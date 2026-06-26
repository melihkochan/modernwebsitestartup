declare namespace Deno {
  export interface ServeOptions {
    port?: number;
    hostname?: string;
    onListen?: (params: { port: number; hostname: string }) => void;
    onError?: (error: unknown) => Response | Promise<Response>;
  }

  export function serve(
    handler: (request: Request, info: any) => Response | Promise<Response>
  ): void;
  export function serve(
    options: ServeOptions,
    handler: (request: Request, info: any) => Response | Promise<Response>
  ): void;

  export const env: {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): Record<string, string>;
  };
}
