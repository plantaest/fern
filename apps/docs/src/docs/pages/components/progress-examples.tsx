import ProgressBasicUsageDemo from './progress-demos/basic-usage';
import basicUsageSource from './progress-demos/basic-usage.tsx?raw';
import ProgressColorsDemo from './progress-demos/colors';
import colorsSource from './progress-demos/colors.tsx?raw';
import ProgressCustomRangeDemo from './progress-demos/custom-range';
import customRangeSource from './progress-demos/custom-range.tsx?raw';
import ProgressDisabledDemo from './progress-demos/disabled';
import disabledSource from './progress-demos/disabled.tsx?raw';
import ProgressIndeterminateDemo from './progress-demos/indeterminate';
import indeterminateSource from './progress-demos/indeterminate.tsx?raw';
import ProgressSizesDemo from './progress-demos/sizes';
import sizesSource from './progress-demos/sizes.tsx?raw';
import ProgressWithLabelAndValueDemo from './progress-demos/with-label-and-value';
import withLabelAndValueSource from './progress-demos/with-label-and-value.tsx?raw';

export const progressBasicUsageExample = {
  component: ProgressBasicUsageDemo,
  source: basicUsageSource,
};

export const progressWithLabelAndValueExample = {
  component: ProgressWithLabelAndValueDemo,
  source: withLabelAndValueSource,
};

export const progressIndeterminateExample = {
  component: ProgressIndeterminateDemo,
  source: indeterminateSource,
};

export const progressCustomRangeExample = {
  component: ProgressCustomRangeDemo,
  source: customRangeSource,
};

export const progressSizesExample = {
  component: ProgressSizesDemo,
  source: sizesSource,
};

export const progressColorsExample = {
  component: ProgressColorsDemo,
  source: colorsSource,
};

export const progressDisabledExample = {
  component: ProgressDisabledDemo,
  source: disabledSource,
};
