import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { KafkaModule } from './kafka/kafka.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [OrdersModule, KafkaModule, ElasticsearchModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
