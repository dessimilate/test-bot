import { BACK_BUTTON } from '@/constants/bot-commands'
import { SCENES_ID } from '@/constants/scenes'
import { TestService } from '@/services/test.service'
import { Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Scene } from 'nestjs-telegraf/dist/decorators/core/scene.decorator'
import { Action } from 'nestjs-telegraf/dist/decorators/listeners/action.decorator'
import { Ctx } from 'nestjs-telegraf/dist/decorators/params/context.decorator'
import { SceneEnter } from 'nestjs-telegraf/dist/decorators/scene/scene-enter.decorator'

@Injectable()
@Scene(SCENES_ID.TEST_SCENE)
export class TestScene {
	private readonly BACK_LINK = SCENES_ID.STUDENT_SCENE

	constructor(private readonly testService: TestService) {}

	@SceneEnter()
	async sceneEnter(@Ctx() ctx: Context) {
		await this.testService.testStart(ctx)
	}

	@Action(/\d+/gi)
	async lecturerScene(@Ctx() ctx: Context) {
		await this.testService.setAnswer(ctx)
	}

	@Action(BACK_BUTTON.NAME)
	async backScene(@Ctx() ctx: Context) {
		await this.testService.backScene(ctx, this.BACK_LINK)
	}
}
