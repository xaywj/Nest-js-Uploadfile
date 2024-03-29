import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class Datarespone<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const res= context.switchToHttp().getResponse();
    res.status(200); // custom status to 200 when success
    return next.handle().pipe(
      map((data) => ({
        data: data,
        status: 200,
        message: 'success', 
        path: context.switchToHttp().getRequest().url, 
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
