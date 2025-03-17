import { Controller, Get, Post, Put, Body, Param, Query, ParseBoolPipe, ParseIntPipe } from '@nestjs/common';
import { DistributorsService } from './distributors.service';
import { Distributor } from './interfaces/distributor.interface';

@Controller('distributors')
export class DistributorsController {
  constructor(private readonly distributorsService: DistributorsService) {}

  @Get()
  findAll(@Query('active') active?: string) {
    // Si active está definido, lo convertimos a booleano
    const activeFilter = active ? active.toLowerCase() === 'true' : undefined;
    return this.distributorsService.findAll(activeFilter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.distributorsService.findOne(id);
  }

  @Post()
  create(@Body() createDistributorDto: { name: string; active: boolean }) {
    return this.distributorsService.create(createDistributorDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDistributorDto: { name?: string; active?: boolean }
  ) {
    return this.distributorsService.update(id, updateDistributorDto);
  }
}