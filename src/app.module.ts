import { ConfigModule } from '@nestjs/config'
import { Postgres } from '@telegraf/session/pg'
import { session } from 'telegraf'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TelegrafModule } from 'nestjs-telegraf/dist/telegraf.module'
import { MainScene } from './scenes/main.scene'
import { MainService } from './services/main.service'
import { PrismaService } from './prisma.service'
import { AppUpdate } from './app.update'
import { StudentScene } from './scenes/student.scene'
import { StudentService } from './services/student.service'
import { LecturerScene } from './scenes/lecturer.scene'
import { LecturerService } from './services/lecturer.service'
import { TestScene } from './scenes/test.scene'
import { TestService } from './services/test.service'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TelegrafModule.forRoot({
			middlewares: [
				session({
					store: Postgres({
						host: process.env.DB_HOST,
						port: +process.env.DB_PORT,
						database: process.env.DB_NAME,
						user: process.env.DB_USERNAME,
						password: process.env.DB_PASSWORD
					})
				})
			],
			token: process.env.BOT_TOKEN
		})
	],
	providers: [
		PrismaService,
		AppUpdate,
		MainService,
		MainScene,
		StudentScene,
		StudentService,
		LecturerScene,
		LecturerService,
		TestScene,
		TestService
	]
})
export class AppModule {}
