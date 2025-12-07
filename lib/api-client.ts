interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  timeout?: number;
  retries?: number;
}

export class ApiClient {
  private static readonly DEFAULT_TIMEOUT = 30000;
  private static readonly DEFAULT_RETRIES = 1;

  private static async request<T>(
    url: string,
    options: RequestInit & { timeout?: number; retries?: number } = {}
  ): Promise<T> {
    const { timeout = this.DEFAULT_TIMEOUT, retries = this.DEFAULT_RETRIES, ...fetchOptions } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = this.parseError(errorData);
          throw new Error(`${response.status} ${response.statusText}: ${errorMessage}`);
        }

        const data = await response.json();
        return data as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (lastError.message.includes("AbortError")) {
          lastError = new Error(`Request timeout after ${timeout}ms`);
        }

        if (attempt === retries) {
          throw lastError;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    throw lastError || new Error("Request failed");
  }

  private static async requestBlob(
    url: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<{ blob: Blob; contentType: string }> {
    const { timeout = this.DEFAULT_TIMEOUT, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = this.parseError(errorData);
        throw new Error(`${response.status} ${response.statusText}: ${errorMessage}`);
      }

      const blob = await response.blob();
      const contentType = response.headers.get("content-type") || "application/octet-stream";

      return { blob, contentType };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.message.includes("AbortError")) {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      throw error;
    }
  }

  private static parseError(errorData: any): string {
    if (typeof errorData === "string") {
      return errorData;
    }

    if (errorData.error) {
      if (typeof errorData.error === "string") {
        return errorData.error;
      }
      if (typeof errorData.error === "object" && errorData.error.message) {
        return errorData.error.message;
      }
    }

    if (errorData.message) {
      return errorData.message;
    }

    return "An error occurred";
  }

  static async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "GET",
    });
  }

  static async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async postFormData<T>(url: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: formData,
    });
  }

  static async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "DELETE",
    });
  }

  static async getBlob(url: string, options?: RequestOptions): Promise<{ blob: Blob; contentType: string }> {
    return this.requestBlob(url, {
      ...options,
      method: "GET",
    });
  }
}
