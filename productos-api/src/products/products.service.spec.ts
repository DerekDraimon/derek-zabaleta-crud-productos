import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProductsService);
    repo = module.get(getRepositoryToken(Product)) as jest.Mocked<Repository<Product>>;
  });

  it('create should persist product', async () => {
    const dto = { nombre: 'Mouse', precio: 10.5, stock: 5 };
    const product = { id: 'uuid', ...dto } as Product;
    repo.create.mockReturnValue(product);
    repo.save.mockResolvedValue(product);

    await expect(service.create(dto)).resolves.toEqual(product);
  });
});