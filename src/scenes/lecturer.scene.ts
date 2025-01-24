import { closeWindow } from '@/buttons/close/button'
import { CLOSE } from '@/buttons/close/button-name'
import { BUTTON_NAMES } from '@/buttons/lecturer-menu/button-names'
import { BACK_BUTTON } from '@/constants/bot-commands'
import { SCENES_ID } from '@/constants/scenes'
import { LecturerService } from '@/services/lecturer.service'
import { type Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common'
import {
	Action,
	Ctx,
	Hears,
	InlineQuery,
	On,
	SceneEnter
} from 'nestjs-telegraf'
import { Scene } from 'nestjs-telegraf/dist/decorators/core/scene.decorator'

@Injectable()
@Scene(SCENES_ID.LECTURER_SCENE)
export class LecturerScene {
	private readonly BACK_LINK = SCENES_ID.MAIN_SCENE

	constructor(private readonly lecturerService: LecturerService) {}

	@SceneEnter()
	async sceneEnter(@Ctx() ctx: Context) {
		await this.lecturerService.getLecturerMenu(ctx)
	}

	@Action(BUTTON_NAMES.LAST_TEST_STATISTICS.NAME)
	async lastTest(@Ctx() ctx: Context) {
		await this.lecturerService.lastTestStats(ctx)
	}

	@Action(BUTTON_NAMES.ALL_TESTS.NAME)
	async allTests(@Ctx() ctx: Context) {
		await this.lecturerService.allTests(ctx)
	}

	@Action(new RegExp(`${BUTTON_NAMES.VIEW_TEST.NAME}.+`))
	async viewTest(@Ctx() ctx: Context) {
		await this.lecturerService.viewQuestions(ctx)
	}

	@On('document')
	async onDocument(@Ctx() ctx: Context) {
		await this.lecturerService.processDocument(ctx)
	}

	@Action(BACK_BUTTON.NAME)
	async backScene(@Ctx() ctx: Context) {
		await this.lecturerService.backScene(ctx, this.BACK_LINK)
	}
}
