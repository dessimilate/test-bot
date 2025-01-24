import { IQuestion } from '@/services/lecturer.service'
import { Test } from '@prisma/client'
import type {
	Chat,
	Document,
	Message,
	PhotoSize,
	Update
} from 'telegraf/typings/core/types/typegram'
import type {
	SceneContext,
	SceneSession,
	SceneSessionData
} from 'telegraf/typings/scenes'

export enum Roles {
	moderator = 'moderator',
	admin = 'admin',
	superAdmin = 'super admin'
}

export type sessionType = {
	user_id: number

	first_name: string
	last_name: string

	name: string

	role: Roles

	main_menu_id: number
	student_menu_id: number
	lecturer_menu_id: number

	test: {
		id: string
		questions: IQuestion[]
		questions_number: number
		correct: number
	}

	last_created_test_id: string
}

export interface Context extends SceneContext {
	session: sessionType & SceneSession<SceneSessionData>

	update: Update & {
		// Inline
		chosen_inline_result: {
			from: {
				id: number
			}
			query: string
			result_id: number
		}

		//Callback
		callback_query: {
			message: {
				message_id: number
			}
			from: {
				id: number
			}
		}

		//Message
		message: Message & {
			chat: {
				id: number
			}
			message_id: number
			photo: PhotoSize[]
			document: Document
		}
	}

	chat: Chat & {
		first_name?: string
		last_name?: string
		username?: string
	}

	match: string[]
}
