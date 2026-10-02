import copy,json,pathlib,tempfile,unittest
import sync
ROOT=pathlib.Path(__file__).resolve().parents[2]
class FakeAPI:
    prefix='https://livingdictionaries.app/api/v1/dictionaries/test'
    def __init__(self):self.rows={};self.sources=[];self.writes=0
    def get(self,id):return copy.deepcopy(self.rows.get(id))
    def call(self,method,path='',body=None):
        if method=='GET' and path=='':return {'gloss_languages':['es']}
        if method=='GET' and path=='/sources':return {'sources':copy.deepcopy(self.sources)}
        if method=='POST' and path=='/sources':self.sources.append(copy.deepcopy(body));return {'source':body}
        if method=='POST' and path=='/entries':
            self.writes+=1;e=copy.deepcopy(body['entries'][0]);id=e.pop('id');s=e.pop('senses');self.rows[id]={'entry':{'id':id,'main':e,'senses':s}};return {'results':[{'status':'created','entry_id':id}]}
        if method=='PATCH':
            self.writes+=1;id=path.split('/')[-1];e=copy.deepcopy(body);s=e.pop('senses');self.rows[id]['entry']['main'].update(e);self.rows[id]['entry']['senses']=s;return self.get(id)
        raise AssertionError((method,path))
class Tests(unittest.TestCase):
    def setUp(self):
        self.master=json.loads((ROOT/'data/lexicon-master.json').read_text());self.bundle=sync.build(self.master,'1.0.0');self.api=FakeAPI();self.state={};self.tmp=tempfile.TemporaryDirectory();self.path=pathlib.Path(self.tmp.name)/'state.json'
    def tearDown(self):self.tmp.cleanup()
    def apply(self,name='trial'):return sync.run(self.bundle,self.api,self.state,self.path,True,name,True)
    def test_deterministic(self):self.assertEqual(sync.canonical(self.bundle),sync.canonical(sync.build(self.master,'1.0.0')))
    def test_first_then_second_noop(self):
        self.apply();self.assertEqual(self.api.writes,3);self.apply('second');self.assertEqual(self.api.writes,3);self.assertEqual(len(self.api.rows),3)
    def test_local_edit_blocks_whole_batch(self):
        self.apply();id=self.bundle['entries'][0]['id'];self.api.rows[id]['entry']['main']['notes']['es']='Community edit'
        with self.assertRaises(RuntimeError):self.apply('conflict')
        self.assertEqual(self.api.writes,3)
    def test_unowned_id_blocks(self):
        self.apply();self.state={}
        with self.assertRaises(RuntimeError):self.apply('unknown')
    def test_update_same_id(self):
        self.apply();e=self.bundle['entries'][0];e['senses'][0]['glosses']['es']='Synthetic test only';self.apply('update');self.assertEqual(len(self.api.rows),3);self.assertEqual(self.api.writes,4)
    def test_sense_removal_blocks(self):
        self.apply();self.bundle['entries'][0]['senses']=[]
        with self.assertRaises(RuntimeError):self.apply('remove')
    def test_selection_removal_requires_unpublish(self):
        self.apply();self.bundle['entries']=self.bundle['entries'][1:];self.assertIn('manual-unpublish',[a['action'] for a in sync.plan(self.bundle,self.api,self.state)])
    def test_rollback_no_delete(self):
        self.apply();journal=json.loads((self.path.parent/'trial.journal.json').read_text());p=sync.rollback_plan(journal);self.assertFalse(p['automatic_deletion']);self.assertEqual(len(p['steps']),3)
    def test_dry_run_no_writes(self):sync.run(self.bundle,self.api,self.state,self.path);self.assertEqual(self.api.writes,0);self.assertFalse(self.path.exists())
    def test_editor_pause_required(self):
        with self.assertRaises(RuntimeError):sync.run(self.bundle,self.api,self.state,self.path,True,'no-pause',False)
    def test_result_count_mismatch_keeps_journal(self):
        original=self.api.call
        def bad(method,path='',body=None):
            if path=='/entries':return {'results':[]}
            return original(method,path,body)
        self.api.call=bad
        with self.assertRaises(RuntimeError):self.apply()
        self.assertFalse(self.path.exists());self.assertTrue((self.path.parent/'trial.journal.json').exists())
    def test_secret_missing(self):
        import os
        from unittest.mock import patch
        with patch.dict(os.environ,{},clear=True):
            with self.assertRaises(RuntimeError):sync.API('test')
if __name__=='__main__':unittest.main()
