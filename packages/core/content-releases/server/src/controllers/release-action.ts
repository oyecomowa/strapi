import type Koa from 'koa';
import {
  validateReleaseActionCreateSchema,
  validateReleaseActionUpdateSchema,
} from './validation/release-action';
import type {
  CreateReleaseAction,
  UpdateReleaseAction,
} from '../../../shared/contracts/release-actions';
import { getService } from '../utils';

const releaseActionController = {
  async create(ctx: Koa.Context) {
    const releaseId: CreateReleaseAction.Request['params']['releaseId'] = ctx.params.releaseId;
    const releaseActionArgs: CreateReleaseAction.Request['body'] = ctx.request.body;

    await validateReleaseActionCreateSchema(releaseActionArgs);

    const releaseService = getService('release', { strapi });
    const releaseAction = await releaseService.createAction(releaseId, releaseActionArgs);

    ctx.body = {
      data: releaseAction,
    };
  },
  async update(ctx: Koa.Context) {
    const actionId: UpdateReleaseAction.Request['params']['actionId'] = ctx.params.actionId;
    const releaseActionUpdateArgs: UpdateReleaseAction.Request['body'] = ctx.request.body;

    await validateReleaseActionUpdateSchema(releaseActionUpdateArgs);

    const releaseService = getService('release', { strapi });
    const updatedAction = await releaseService.updateAction(actionId, releaseActionUpdateArgs);

    ctx.body = {
      data: updatedAction,
    };
  },
};

export default releaseActionController;
