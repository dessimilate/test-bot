import { BUTTON_NAMES } from '@/buttons/student-menu/button-names'
import { BACK_BUTTON } from '@/constants/bot-commands'
import { SCENES_ID } from '@/constants/scenes'
import { StudentService } from '@/services/student.service'
import { type Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common'
import { Action, Ctx, Hears, SceneEnter } from 'nestjs-telegraf'
import { Scene } from 'nestjs-telegraf/dist/decorators/core/scene.decorator'

@Injectable()
@Scene(SCENES_ID.STUDENT_SCENE)
export class StudentScene {
	private readonly BACK_LINK = SCENES_ID.MAIN_SCENE

	constructor(private readonly studentService: StudentService) {}

	@SceneEnter()
	async sceneEnter(@Ctx() ctx: Context) {
		await this.studentService.getStudentMenu(ctx)
	}

	@Action(BUTTON_NAMES.TAKE_THE_TEST.NAME)
	async studentScene(@Ctx() ctx: Context) {
		// await ctx.scene.enter(SCENES_ID.STUDENT_SCENE)
	}

	@Action(BUTTON_NAMES.PREVIOUS_TESTS.NAME)
	async lecturerScene(@Ctx() ctx: Context) {
		// await ctx.scene.enter(SCENES_ID.LECTURER_SCENE)
	}

	@Hears(new RegExp(`^${BUTTON_NAMES.TAKE_THE_TEST.NAME}.+`))
	async changeName(@Ctx() ctx: Context) {
		await this.studentService.takeTheTest(ctx)
	}

	@Action(BACK_BUTTON.NAME)
	async backScene(@Ctx() ctx: Context) {
		await this.studentService.backScene(ctx, this.BACK_LINK)
	}
}
