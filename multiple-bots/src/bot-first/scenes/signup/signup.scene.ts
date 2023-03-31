import { IStepContext } from '@vk-io/scenes';
import { Scene, AddStep, Context, SceneEnter, SceneLeave } from 'nestjs-vk';
import { StateType } from 'src/bot-first/scenes/signup/state.type';
import { ScenesIds } from 'src/common/enums/scenens-ids.enum';

@Scene(ScenesIds.signup)
export class BestScene {
  // Calls once
  constructor() {}

  // Calls on every message
  @SceneEnter()
  onSceneEnter() {}

  // Calls once
  @SceneLeave()
  onSceneLeave() {}

  // If ctx.stene.step === 10, then calls on every message
  @AddStep(10)
  step10(@Context() context: IStepContext<StateType>) {
    if (context.scene.step.firstTime || !context.text) {
      return context.send('bot1: any for exit or gg for repeat');
    }

    if (context.text === 'gg') {
      return context.scene.step.go(0);
    }

    // Automatic exit
    context.scene.step.next();
  }

  // If ctx.stene.step === 1, then calls on every message
  @AddStep()
  step1(@Context() context: IStepContext<StateType>) {
    if (context.scene.step.firstTime || !context.text) {
      return context.send("bot1: What's your name?");
    }

    context.session.user = {};
    context.session.user.firstName = context.text;

    context.scene.step.next();
  }

  // If ctx.stene.step === 2, then calls on every message
  @AddStep()
  step2(@Context() context: IStepContext<StateType>) {
    if (context.scene.step.firstTime || !context.text) {
      return context.send('bot1: How old are you?');
    }

    context.session.user.age = Number(context.text);

    context.scene.step.next();
  }

  // If ctx.stene.step === 3, then calls on every message
  @AddStep()
  async step3(@Context() context: IStepContext<StateType>) {
    const { firstName, age } = context.session.user;

    await context.send(`bot1: 👤 ${firstName} ${age} ages`);

    // Next step is step10
    context.scene.step.next();
  }
}
