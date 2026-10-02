#!/usr/bin/env python3
"""Bounded, deterministic RD → LD pilot. No delete or publication operations."""
import argparse, copy, datetime, hashlib, json, os, pathlib, re, sys, unicodedata, uuid
from urllib import request, error, parse
BASE = 'https://livingdictionaries.app/api/v1'
NAMESPACE = uuid.uuid5(uuid.NAMESPACE_URL, 'https://github.com/fersandovalgtz/raramuri-digital')
SLUG = 'raramuri-digital'
ALLOWLIST = ['RD-000031', 'RD-000046', 'RD-000054']

def canonical(x):
    return json.dumps(x, ensure_ascii=False, sort_keys=True, separators=(',', ':'))

def digest(x):
    return hashlib.sha256(canonical(x).encode()).hexdigest()

def save(path, obj):
    path = pathlib.Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp'); tmp.write_text(canonical(obj)+'\n'); tmp.replace(path)

def build(master, version):
    if len({e['record_id'] for e in master}) != len(master):
        raise ValueError('Duplicate canonical IDs')
    selected = {e['record_id']: e for e in master if e['record_id'] in ALLOWLIST}
    if set(selected) != set(ALLOWLIST): raise ValueError('Missing allowlisted record')
    entries=[]; staging=[]
    for rid in ALLOWLIST:
        e=selected[rid]
        if not re.fullmatch(r'RD-\d{6}',rid) or not e['senses']:
            raise ValueError('Invalid canonical record')
        if e['examples'] or e['variants'] or e['comments_raw'] or e['homonym_number']:
            raise ValueError('Pilot excludes complex records')
        locator=f"{rid} v{version}; {e['source_code']}; {e['source_document']}; PDF pp. {e['page_start']}-{e['page_end']}"
        cites=[{'slug':SLUG,'locator':locator}]
        entry={'id':str(uuid.uuid5(NAMESPACE,rid)), 'lexeme':{'default':e['headword']},
          'citations':cites, 'notes':{'es':f"Rarámuri Digital {rid}, datos v{version}. Forma fuente: {e['headword_raw']}. Categoría documental: {e['classification']}. Publicación técnica autorizada; validación lingüística comunitaria pendiente. CC BY-NC-SA 4.0. https://raramuri.ceees.mx/api/lexicon?id={rid}"},
          'senses':[{'id':str(uuid.uuid5(NAMESPACE,f'{rid}/sense/{i+1}')), 'glosses':{'es':meaning}, 'parts_of_speech':[{'Adj':'adj','Vi':'vi'}[e['classification']]], 'citations':cites} for i,meaning in enumerate(e['senses'])]}
        entries.append(entry); staging.append({'record_id':rid,'verbatim':e,'payload':entry})
    natural=[unicodedata.normalize('NFC',e['lexeme']['default']).strip().casefold() for e in entries]
    if len(set(natural))!=len(natural):raise ValueError('Natural-key collision')
    source={'slug':SLUG,'citation':f'Sandoval Gutierrez, F. (2026). Rarámuri Digital: conjunto de datos lexicográficos rarámuri–español (versión {version}). DOI: 10.5281/zenodo.21483353. Validación lingüística pendiente.', 'abbreviation':'Rarámuri Digital', 'author':'Fernando Sandoval Gutierrez','year':'2026','type':'dictionary','url':'https://github.com/fersandovalgtz/raramuri-digital','license':'CC BY-NC-SA 4.0'}
    return {'mapping_version':'pilot-1','namespace':str(NAMESPACE),'source':source,'entries':entries,'staging':staging}

class NoRedirect(request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):raise RuntimeError('Redirect rejected')

class API:
    def __init__(self,dictionary):
        if not re.fullmatch(r'[A-Za-z0-9_-]+',dictionary):raise ValueError('Invalid dictionary id')
        key=os.environ.get('LD_API_KEY')
        if not key:raise RuntimeError('LD_API_KEY missing; do not paste keys in chat')
        self.prefix=f'{BASE}/dictionaries/{dictionary}'; self.key=key
        self.opener=request.build_opener(NoRedirect())
    def call(self,method,path='',body=None,missing=False):
        if method=='DELETE':raise RuntimeError('Destructive operation disabled')
        req=request.Request(self.prefix+path,method=method,headers={'Authorization':'Bearer '+self.key,'User-Agent':'RaramuriDigital-Pilot/1','Content-Type':'application/json'},data=canonical(body).encode() if body is not None else None)
        try:
            with self.opener.open(req,timeout=30) as r: result=json.load(r)
        except error.HTTPError as e:
            if missing and e.code==404:return None
            raise RuntimeError(f'API HTTP {e.code}; body withheld') from None
        if result.get('warnings'):raise RuntimeError('API warnings: stop and inspect the API contract; write may have succeeded')
        return result
    def get(self,id):return self.call('GET','/entries/'+id,missing=True)

def fingerprint(response):
    # Full read model, including other contributors/media; omit only server timestamps.
    def strip(x):
        if isinstance(x,dict):return {k:strip(v) for k,v in x.items() if k not in ('updated_at','created_at')}
        if isinstance(x,list):return [strip(v) for v in x]
        return x
    return digest(strip(response))

def verify(wanted,response):
    entry=response['entry']; main=entry['main']
    for field in ['lexeme','notes']:
        if main.get(field)!=wanted[field]:raise RuntimeError('Readback mismatch: '+field)
    for citation in wanted['citations']:
        if citation not in (main.get('citations') or []):raise RuntimeError('Citation missing')
    actual={s['id']:s for s in entry['senses']}
    if set(actual)!=set(s['id'] for s in wanted['senses']):raise RuntimeError('Unexpected/missing senses')
    for s in wanted['senses']:
        for field in ['glosses','parts_of_speech']:
            if actual[s['id']].get(field)!=s[field]:raise RuntimeError('Sense mismatch: '+field)
        for c in s['citations']:
            if c not in (actual[s['id']].get('citations') or []):raise RuntimeError('Sense citation missing')

def plan(bundle,api,state):
    actions=[]
    for e in bundle['entries']:
        remote=api.get(e['id']); old=state.get('records',{}).get(e['id'])
        if remote is None:
            action='conflict-missing' if old else 'create'
        elif not old:action='conflict-unowned'
        elif fingerprint(remote)!=old['remote_hash']:action='conflict-local-edit'
        elif digest(e)==old['payload_hash']:action='noop'
        elif {s['id'] for s in e['senses']} != {s['id'] for s in old['payload']['senses']}:action='review-sense-change'
        else:action='update'
        actions.append({'id':e['id'],'action':action,'before':remote,'payload':e})
    selected=set(e['id'] for e in bundle['entries'])
    for id in state.get('records',{}):
        if id not in selected:actions.append({'id':id,'action':'manual-unpublish','before':api.get(id)})
    return actions

def run(bundle,api,state,path,apply=False,import_id=None,editors_paused=False):
    expected_ids={str(uuid.uuid5(NAMESPACE,rid)) for rid in ALLOWLIST}
    ids=[e['id'] for e in bundle['entries']]
    if not 1 <= len(ids) <= 3 or len(set(ids))!=len(ids) or not set(ids)<=expected_ids:
        raise RuntimeError('Only the three pilot IDs are allowed')
    for e in bundle['entries']:
        if set(e)-{'id','lexeme','notes','citations','senses'} or len(e['senses'])!=1:
            raise RuntimeError('Pilot shape changed; review required')
        if set(e['senses'][0])-{'id','glosses','parts_of_speech','citations'}:
            raise RuntimeError('Media or additional fields disabled')
    if state and state.get('dictionary')!=api.prefix:raise RuntimeError('Ledger belongs to another dictionary')
    meta=api.call('GET')
    # API metadata shape must be inspected live; do not assume locale configuration.
    metadata=meta.get('dictionary',meta)
    langs=metadata.get('gloss_languages',[])
    codes=[v if isinstance(v,str) else v.get('code') for v in langs]
    if 'es' not in codes:raise RuntimeError('Spanish gloss language not confirmed')
    actions=plan(bundle,api,state)
    if not apply:return {'mode':'dry-run','actions':actions}
    if not editors_paused:raise RuntimeError('Pause collaborators during pilot: API has no documented conditional write')
    if not import_id or not re.fullmatch(r'[A-Za-z0-9_-]{1,100}',import_id):raise ValueError('Explicit import_id required')
    if any(a['action'] not in ['create','update','noop'] for a in actions):raise RuntimeError('Review/conflict blocks all writes')
    # Persist full preflight snapshot before the first mutation; recover uncertain writes manually.
    journal={'import_id':import_id,'bundle_hash':digest(bundle),'before_state':copy.deepcopy(state),'actions':actions,'status':'prepared'}
    journal_path=pathlib.Path(path).parent/(import_id+'.journal.json')
    if journal_path.exists():raise RuntimeError('import_id already used; inspect its journal before resuming')
    save(journal_path,journal)
    sources=api.call('GET','/sources').get('sources',[])
    source=next((s for s in sources if s.get('slug')==SLUG),None)
    if source and any(source.get(k)!=v for k,v in bundle['source'].items()):raise RuntimeError('Existing source differs; human review required')
    if not source:api.call('POST','/sources',bundle['source'])
    state.setdefault('records',{});state['dictionary']=api.prefix
    for a in actions:
        if a['action']=='noop':continue
        latest=api.get(a['id'])
        if fingerprint(latest)!=fingerprint(a['before']):raise RuntimeError('Concurrent change before write')
        journal['status']='writing';journal['pending']=a['id'];save(journal_path,journal)
        if a['action']=='create':
            result=api.call('POST','/entries',{'import_id':import_id,'entries':[a['payload']]})
            rows=result.get('results',[])
            if len(rows)!=1 or rows[0].get('status')!='created' or rows[0].get('entry_id')!=a['id']:
                raise RuntimeError('Unexpected result; inspect journal/readback before retrying')
        else:
            payload={k:v for k,v in a['payload'].items() if k!='id'}
            # The API merges citations; retain historical provenance. No removal paths.
            api.call('PATCH','/entries/'+a['id'],payload)
        after=api.get(a['id']);verify(a['payload'],after)
        state['records'][a['id']]={'payload':copy.deepcopy(a['payload']),'payload_hash':digest(a['payload']),'remote_hash':fingerprint(after),'import_id':import_id}
        save(path,state);journal['pending']=None;save(journal_path,journal)
    journal['status']='verified';save(journal_path,journal)
    return {'mode':'apply','import_id':import_id,'actions':[{'id':a['id'],'action':a['action']} for a in actions]}

def rollback_plan(journal):
    return {'automatic_deletion':False,'steps':[{'id':a['id'],'action':'keep-private-or-manually-unpublish' if a['action']=='create' else 'review-and-restore-from-before-snapshot','before':a['before']} for a in journal['actions'] if a['action']!='noop'], 'note':'Publication is a human UI decision. Never use batch-delete as an automatic rollback. Restore content after drift review; keep citation history.'}

def main():
    p=argparse.ArgumentParser();p.add_argument('command',choices=['stage','sync','rollback-plan']);p.add_argument('--repo',default='../..');p.add_argument('--bundle',default='pilot.bundle.json');p.add_argument('--state',default='private/state.json');p.add_argument('--dictionary');p.add_argument('--apply',action='store_true');p.add_argument('--import-id');p.add_argument('--editors-paused',action='store_true');p.add_argument('--journal');p.add_argument('--private-dictionary-confirmed',action='store_true');p.add_argument('--out',default='result.json');a=p.parse_args()
    if a.command=='stage':
        root=pathlib.Path(a.repo);master=json.loads((root/'data/lexicon-master.json').read_text());export=json.loads((root/'public/downloads/raramuri-lexico.json').read_text())
        result=build(master,export['dataset_version']);save(a.bundle,result)
        preview='\n'.join(f"{s['record_id']}: {s['verbatim']['headword']} → {', '.join(s['verbatim']['senses'])}; PDF p. {s['verbatim']['page_start']}" for s in result['staging'])
        pathlib.Path(a.out).write_text(preview+'\n');print(preview);return
    if a.command=='rollback-plan':result=rollback_plan(json.loads(pathlib.Path(a.journal).read_text()))
    else:
        if not a.dictionary:raise ValueError('--dictionary required')
        if a.apply and not a.private_dictionary_confirmed:raise RuntimeError('Confirm a dedicated private pilot dictionary before writing')
        state=json.loads(pathlib.Path(a.state).read_text()) if pathlib.Path(a.state).exists() else {}
        result=run(json.loads(pathlib.Path(a.bundle).read_text()),API(a.dictionary),state,a.state,a.apply,a.import_id,a.editors_paused)
    save(a.out,result);print('Result saved; no secrets logged.')

if __name__=='__main__':
    try:main()
    except (RuntimeError,ValueError,KeyError) as e:print(str(e),file=sys.stderr);sys.exit(1)
