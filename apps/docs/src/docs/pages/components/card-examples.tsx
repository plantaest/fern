import CardBasicDemo from './card-demos/basic';
import basicSource from './card-demos/basic.tsx?raw';
import CardCoverImageDemo from './card-demos/cover-image';
import coverImageSource from './card-demos/cover-image.tsx?raw';
import CardGroupDemo from './card-demos/group';
import groupSource from './card-demos/group.tsx?raw';
import CardLinkDemo from './card-demos/link';
import linkSource from './card-demos/link.tsx?raw';
import CardMediaAndTitleOnlyDemo from './card-demos/media-and-title-only';
import mediaAndTitleOnlySource from './card-demos/media-and-title-only.tsx?raw';
import CardThumbnailPositionsDemo from './card-demos/thumbnail-positions';
import thumbnailPositionsSource from './card-demos/thumbnail-positions.tsx?raw';
import CardWithActionsDemo from './card-demos/with-actions';
import withActionsSource from './card-demos/with-actions.tsx?raw';

export const cardBasicExample = {
  component: CardBasicDemo,
  source: basicSource,
};

export const cardLinkExample = {
  component: CardLinkDemo,
  source: linkSource,
};

export const cardCoverImageExample = {
  component: CardCoverImageDemo,
  source: coverImageSource,
};

export const cardThumbnailPositionsExample = {
  component: CardThumbnailPositionsDemo,
  source: thumbnailPositionsSource,
};

export const cardMediaAndTitleOnlyExample = {
  component: CardMediaAndTitleOnlyDemo,
  source: mediaAndTitleOnlySource,
};

export const cardGroupExample = {
  component: CardGroupDemo,
  source: groupSource,
};

export const cardWithActionsExample = {
  component: CardWithActionsDemo,
  source: withActionsSource,
};
