export abstract class BaseRepository<T> {
  protected abstract get prismaModel(): any;
  protected abstract parseEntity(entity: any): T;

  async findById(id: string): Promise<T | null> {
    const entity = await this.prismaModel.findUnique({ where: { id } });
    if (!entity) return null;
    return this.parseEntity(entity);
  }

  async findByEmail(email: string): Promise<T | null> {
    const entity = await this.prismaModel.findUnique({ where: { email } });
    if (!entity) return null;
    return this.parseEntity(entity);
  }

  async save(entity: T): Promise<T> {
    const data = (entity as any).toPrisma();
    const saved = await this.prismaModel.create({ data });
    return this.parseEntity(saved);
  }
}
