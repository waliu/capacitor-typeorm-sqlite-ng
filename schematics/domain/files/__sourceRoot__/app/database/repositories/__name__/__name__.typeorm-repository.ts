import { Repository } from 'typeorm/browser';

import { <%= className %>TypeormEntity } from '../../entities/<%= name %>/<%= name %>.typeorm-entity';
import { <%= className %> } from '../../../services/entities/<%= name %>/<%= name %>';
import {
  Create<%= className %>Input,
  <%= className %>Repository,
} from '../../../services/repositories/<%= name %>/<%= name %>.repository';

export class TypeOrm<%= className %>Repository implements <%= className %>Repository {
  constructor(private readonly repository: Repository<<%= className %>TypeormEntity>) {}

  async findAll(): Promise<<%= className %>[]> {
    const records = await this.repository.find({
      order: {
        id: 'DESC',
      },
    });

    return records.map((record) => this.toModel(record));
  }

  async create(input: Create<%= className %>Input): Promise<<%= className %>> {
    const record = this.repository.create({
      name: input.name,
    });

    return this.toModel(await this.repository.save(record));
  }

  private toModel(entity: <%= className %>TypeormEntity): <%= className %> {
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
