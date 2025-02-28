
export class Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Category> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.slug = data.slug || '';
    this.description = data.description;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
