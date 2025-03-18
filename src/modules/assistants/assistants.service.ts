import {
	Injectable,
	NotFoundException,
	ConflictException,
	InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../../config/supabase/supabase.service';
import { EmailService } from '../../config/email/email.service';
import { Assistant, CreateAssistantRequest, CreateAssistantResponse } from './interfaces/assistants.interface';
import { Transaction } from '../../common/types/payment.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AssistantsService {
	constructor(private supabaseService: SupabaseService, private emailService: EmailService) { }

	async findAll(): Promise<Assistant[]> {
		const { data, error } = await this.supabaseService.client
			.from('assistant')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	}

	async findOne(identification: number): Promise<Assistant> {
		const { data, error } = await this.supabaseService.client
			.from('assistant')
			.select('*')
			.eq('identification', identification)
			.single();

		if (!data) {
			throw new NotFoundException(`Asistente con identificación ${identification} no encontrado`);
		}

		if (error) throw error;
		return data;
	}

	async create(createRequest: CreateAssistantRequest): Promise<CreateAssistantResponse> {
		const { assistant, payment } = createRequest;

		try {
			// aqui logica para realizar el pago
			const transaction: Transaction = {
				assistant: assistant,  
				payment: payment,
				payment_ref: "1234567890",
				payment_status: "pending",
				payment_date: '2025-03-17',
				payment_hour: '10:00',
			}

			//Registramos el asistente 
			const { data: assistantData, error: assistantError } = await this.supabaseService.client
				.from('assistant')
				.insert([assistant])
				.select()
				.single();
			if (assistantError) {
				throw new ConflictException(assistantError);
			} else {
				//registro en la tabla de users_profile
				const hashedPassword = await bcrypt.hash(assistant.identification.toString(), 10);
				const user_profile = {
					identification: assistant.identification,
					first_name: assistant.first_name,
					last_name: assistant.last_name,
					phone: assistant.phone,
					email: assistant.email,
					rol: 'assistant',
					password: hashedPassword,
				}
				const { error: userError } = await this.supabaseService.client
					.from('users_profile')
					.insert([user_profile])
					.select()
					.single();
				if (userError) {
					await this.supabaseService.client
						.from('assistant')
						.delete()
						.eq('identification', assistant.identification);
					throw new ConflictException(userError);
				}
			}

			//Enviamos al correo  el tiket de entrada y el bono
		const emailResponse = await this.emailService.sendTicketEmail(transaction);
			

























			return {
				status: true,
				message: 'Asistente registrado correctamente',
				data: [
					{
						identification: assistant.identification,
						first_name: assistant.first_name,
						last_name: assistant.last_name,
						phone: assistant.phone,
						email: assistant.email,
						city: assistant.city,
					}
				]
			}

		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}




}
