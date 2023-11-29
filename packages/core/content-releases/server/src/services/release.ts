import { setCreatorFields, errors } from '@strapi/utils';
import type { LoadedStrapi } from '@strapi/types';
import { RELEASE_ACTION_MODEL_UID, RELEASE_MODEL_UID } from '../constants';
import type {
  GetReleases,
  CreateRelease,
  UpdateRelease,
  GetRelease,
} from '../../../shared/contracts/releases';
import type {
  CreateReleaseAction,
  UpdateReleaseAction,
} from '../../../shared/contracts/release-actions';
import type { UserInfo } from '../../../shared/types';
import { getService } from '../utils';

const createReleaseService = ({ strapi }: { strapi: LoadedStrapi }) => ({
  async create(releaseData: CreateRelease.Request['body'], { user }: { user: UserInfo }) {
    const releaseWithCreatorFields = await setCreatorFields({ user })(releaseData);

    return strapi.entityService.create(RELEASE_MODEL_UID, {
      data: releaseWithCreatorFields,
    });
  },
  findMany(query?: GetReleases.Request['query']) {
    return strapi.entityService.findPage(RELEASE_MODEL_UID, {
      ...query,
      populate: {
        actions: {
          // @ts-expect-error TS error on populate, is not considering count
          count: true,
        },
      },
    });
  },
  findOne(id: GetRelease.Request['params']['id']) {
    return strapi.entityService.findOne(RELEASE_MODEL_UID, id, {
      populate: {
        actions: {
          // @ts-expect-error TS error on populate, is not considering count
          count: true,
        },
      },
    });
  },
  async update(
    id: number,
    releaseData: UpdateRelease.Request['body'],
    { user }: { user: UserInfo }
  ) {
    const updatedRelease = await setCreatorFields({ user, isEdition: true })(releaseData);

    const release = await strapi.entityService.update(RELEASE_MODEL_UID, id, {
      // @ts-expect-error Type 'ReleaseUpdateArgs' has no properties in common with type 'Partial<Input<"plugin::content-releases.release">>'
      data: updatedRelease,
    });

    if (!release) {
      throw new errors.NotFoundError(`No release found for id ${id}`);
    }

    return release;
  },
  async createAction(
    releaseId: CreateReleaseAction.Request['params']['releaseId'],
    action: Pick<CreateReleaseAction.Request['body'], 'type' | 'entry'>
  ) {
    const { validateEntryContentType, validateUniqueEntry } = getService('release-validation', {
      strapi,
    });

    await Promise.all([
      validateEntryContentType(action.entry.contentType),
      validateUniqueEntry(releaseId, action),
    ]);

    const { entry, type } = action;

    return strapi.entityService.create(RELEASE_ACTION_MODEL_UID, {
      data: {
        type,
        contentType: entry.contentType,
        entry: {
          id: entry.id,
          __type: entry.contentType,
          __pivot: { field: 'entry' },
        },
        release: releaseId,
      },
      populate: { release: { fields: ['id'] }, entry: { fields: ['id'] } },
    });
  },
  async updateAction(
    id: UpdateReleaseAction.Request['params']['actionId'],
    update: UpdateReleaseAction.Request['body']
  ) {
    const updatedAction = await strapi.entityService.update(RELEASE_ACTION_MODEL_UID, id, {
      /**
       * Type 'ReleaseUpdateArgs' has no properties in common with type 'Partial<Input<"plugin::content-releases.release">>'
       * The Partial type from the entity service does not seem to be returning the value since ReleaseUpdateArgs satisfies that type
       */
      // @ts-expect-error see above
      data: update,
    });

    if (!updatedAction) {
      throw new errors.NotFoundError(`No action found for action id ${id}`);
    }

    return updatedAction;
  },
});

export default createReleaseService;
