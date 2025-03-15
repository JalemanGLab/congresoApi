import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { Assistant } from './interfaces/assistants.interface';

@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Get()
  findAll() {
    return this.assistantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assistantsService.findOne(id);
  }

  @Post()
  create(@Body() createAssistantDto: Omit<Assistant, 'id' | 'created_at'>) {
    return this.assistantsService.create(createAssistantDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssistantDto: Partial<Omit<Assistant, 'id' | 'created_at'>>
  ) {
    return this.assistantsService.update(id, updateAssistantDto);
  }
}