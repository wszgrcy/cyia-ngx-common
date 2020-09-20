
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
export class RequestBase {
    constructor(protected http: HttpClient) {}
    protected requestArrayBuffer(url: string): Promise<ArrayBuffer> {
      return this.http
        .get(url, { responseType: 'arraybuffer' })
        .pipe(take(1))
        .toPromise();
    }
    protected requstJson(url: string) {
      return this.http
        .get(url, { responseType: 'json' })
        .pipe(take(1))
        .toPromise();
    }
    protected requestText(url: string) {
      return this.http
        .get(url, { responseType: 'text' })
        .pipe(take(1))
        .toPromise();
    }
  }
