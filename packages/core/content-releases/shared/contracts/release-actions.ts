import { Attribute, Common } from '@strapi/types';
import type { Release } from './releases';
import type { Entity } from '../types';

import type { errors } from '@strapi/utils';

type ReleaseActionEntry = Entity & {
  // Entity attributes
  [key: string]: Attribute.Any;
};

export interface ReleaseAction extends Entity {
  type: 'publish' | 'unpublish';
  entry: ReleaseActionEntry;
  contentType: Common.UID.ContentType;
  release: Release;
}

/**
 * POST /content-releases/:releaseId/actions - Create a release action
 */
export declare namespace CreateReleaseAction {
  export interface Request {
    params: {
      releaseId: Release['id'];
    };
    body: {
      type: ReleaseAction['type'];
      entry: {
        id: ReleaseActionEntry['id'];
        contentType: Common.UID.ContentType;
      };
    };
  }

  export interface Response {
    data: ReleaseAction;
    error?: errors.ApplicationError | errors.ValidationError | errors.NotFoundError;
  }
}

/**
 * DELETE /content-releases/:releaseId/actions/:actionId - Delete a release action
 */

export declare namespace DeleteReleaseAction {
  export interface Request {
    params: {
      actionId: ReleaseAction['id'];
    };
  }

  export interface Response {
    data: ReleaseAction;
    error?: errors.ApplicationError | errors.NotFoundError;
  }
}
