import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { KafkaService } from '../kafka/kafka.service'; // importa seu service

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private kafkaService: KafkaService, // injeta o KafkaService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);

    // Envia mensagem para Kafka após salvar o pedido
    await this.kafkaService.emit('orders-topic', {
      event: 'order_created',
      data: savedOrder,
    });

    return savedOrder;
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    const updatedOrder = await this.ordersRepository.save(order);

    // Envia mensagem para Kafka após atualizar o pedido
    await this.kafkaService.emit('orders-topic', {
      event: 'order_updated',
      data: updatedOrder,
    });

    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);

    // Envia mensagem para Kafka após remover o pedido
    await this.kafkaService.emit('orders-topic', {
      event: 'order_deleted',
      data: { id },
    });
  }
}
