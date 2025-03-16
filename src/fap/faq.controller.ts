import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { FAQService } from './faq.service';
import { FAQ } from './interfaces/faq.intercafes';

@Controller('faq')
export class FAQController {
  constructor(private readonly faqService: FAQService) {}

  @Get()
  findAll(@Query('active', ParseBoolPipe) active?: boolean) {
    return this.faqService.findAll(active);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOne(id);
  }

  @Post()
  create(@Body() createFaqDto: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) {
    return this.faqService.create(createFaqDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaqDto: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at'>>
  ) {
    return this.faqService.update(id, updateFaqDto);
  }

  @Put(':id/toggle')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.toggleActive(id);
  }
}