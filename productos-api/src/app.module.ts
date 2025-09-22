import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST') ?? 'localhost';
        const port = Number(config.get<string>('DB_PORT') ?? '5432');
        const synchronize = (config.get<string>('DB_SYNCHRONIZE') ?? 'true').toLowerCase() === 'true';

        return {
          type: 'postgres',
          host,
          port,
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize,
        };
      },
    }),
    ProductsModule,
  ],
})
export class AppModule {}