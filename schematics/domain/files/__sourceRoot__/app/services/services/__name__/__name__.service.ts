import { Create<%= className %>Dto } from '../../dto/<%= name %>/create-<%= name %>.dto';
import { <%= className %>Dto } from '../../dto/<%= name %>/<%= name %>.dto';
import { <%= className %> } from '../../entities/<%= name %>/<%= name %>';
import { <%= className %>Repository } from '../../repositories/<%= name %>/<%= name %>.repository';

export class <%= className %>Service {
  constructor(private readonly <%= camelName %>Repository: <%= className %>Repository) {}

  async find<%= className %>s(): Promise<<%= className %>Dto[]> {
    const records = await this.<%= camelName %>Repository.findAll();

    return records.map((record) => this.toDto(record));
  }

  async create<%= className %>(input: Create<%= className %>Dto): Promise<<%= className %>Dto> {
    const name = input.name.trim();

    if (!name) {
      throw new Error('<%= className %> name is required.');
    }

    const record = await this.<%= camelName %>Repository.create({ name });

    return this.toDto(record);
  }

  private toDto(record: <%= className %>): <%= className %>Dto {
    return {
      id: record.id,
      name: record.name,
    };
  }
}
