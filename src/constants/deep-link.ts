import { Context } from '@/types/context.interface'

export const deepLink = (ctx: Context) => `https://t.me/${ctx.botInfo.username}?start=`
