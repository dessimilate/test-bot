import { BACK_BUTTON } from '@/constants/bot-commands'
import { SCENES_ID } from '@/constants/scenes'
import { MainService } from '@/services/main.service'
import { StudentService } from '@/services/student.service'
import { type Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common'
import { Action, Ctx, SceneEnter } from 'nestjs-telegraf'
import { Scene } from 'nestjs-telegraf/dist/decorators/core/scene.decorator'

@Injectable()
@Scene(SCENES_ID.STUDENT_SCENE)
export class StudentScene {
	private readonly BACK_LINK = SCENES_ID.MAIN_SCENE

	constructor(
		private readonly mainService: MainService,
		private readonly studentService: StudentService
	) {}

	@SceneEnter()
	async sceneEnter(@Ctx() ctx: Context) {
		await this.studentService.getStudentMenu(ctx)
	}

	@Action(BACK_BUTTON.NAME)
	async backScene(@Ctx() ctx: Context) {
		await this.studentService.backScene(ctx, this.BACK_LINK)
	}
}
