// backend/src/products/products.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ProductsService } from './products.service';

@Controller('products') // <--- Isso define a rota /products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() body: any) {
    console.log('CHEGOU NO CONTROLLER:', body);

    const dadosTradados = {
      name: body.name,
      price: parseFloat(body.price),
    }
    return this.productsService.create(dadosTradados);
  }

  // Faz upload da imagem para um produto existente
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), 'backend', 'public', 'uploads'),
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-\_]/g, '_');
          cb(null, `${timestamp}-${safeName}`);
        },
      }),
    }),
  )
  // Use a permissive type for uploaded file to avoid depending on @types/multer
  async uploadImage(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) return { error: 'No file uploaded' };

    // imageUrl: caminho público a partir do prefix /uploads
    const imageUrl = `/uploads/${file.filename}`;
    return this.productsService.setImage(id, imageUrl);
  }

  @Get() // <--- Este decorador é OBRIGATÓRIO para o navegador funcionar
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}