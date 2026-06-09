import { Create<%= className %>Dto } from '../../dto/<%= name %>/create-<%= name %>.dto';
import { <%= className %>Dto } from '../../dto/<%= name %>/<%= name %>.dto';
import { <%= className %>Service } from '../../services/<%= name %>/<%= name %>.service';

export class <%= className %>Controller {
  constructor(private readonly <%= camelName %>Service: <%= className %>Service) {}

  find<%= className %>s(): Promise<<%= className %>Dto[]> {
    return this.<%= camelName %>Service.find<%= className %>s();
  }

  create<%= className %>(input: Create<%= className %>Dto): Promise<<%= className %>Dto> {
    return this.<%= camelName %>Service.create<%= className %>(input);
  }
}
