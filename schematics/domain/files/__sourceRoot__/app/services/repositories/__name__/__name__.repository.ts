import { <%= className %> } from '../../entities/<%= name %>/<%= name %>';

export interface Create<%= className %>Input {
  readonly name: string;
}

export interface <%= className %>Repository {
  findAll(): Promise<<%= className %>[]>;
  create(input: Create<%= className %>Input): Promise<<%= className %>>;
}
