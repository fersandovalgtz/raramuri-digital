export {};

declare global {
  type WebMCPTextContent = {
    type: "text";
    text: string;
  };

  type WebMCPToolResult = {
    content: WebMCPTextContent[];
    isError?: boolean;
  };

  type WebMCPToolExecutionContext = {
    signal: AbortSignal;
  };

  type WebMCPToolDefinition = {
    name: string;
    title?: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations?: {
      readOnlyHint?: boolean;
      untrustedContentHint?: boolean;
    };
    execute: (
      input: Record<string, unknown>,
      context: WebMCPToolExecutionContext,
    ) => WebMCPToolResult | Promise<WebMCPToolResult>;
  };

  type WebMCPRegistrationOptions = {
    signal?: AbortSignal;
  };

  interface WebMCPModelContext {
    registerTool(
      tool: WebMCPToolDefinition,
      options?: WebMCPRegistrationOptions,
    ): Promise<void>;
  }

  interface Document {
    modelContext?: WebMCPModelContext;
  }
}
