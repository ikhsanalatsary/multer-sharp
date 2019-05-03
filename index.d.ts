import {
  ResizeOptions,
  RGBA,
  Region,
  ExtendOptions,
  ThresholdOptions,
  AvailableFormatInfo,
  OutputOptions,
  JpegOptions,
  PngOptions,
  Kernel,
  OverlayOptions,
  FlattenOptions,
  WriteableMetadata
} from 'sharp';
import { UploadOptions } from '@google-cloud/storage';

export declare interface Size {
    width?: number;
    height?: number;
    option?: ResizeOptions;
}

export declare interface Sharpen {
    sigma?: number;
    flat?: number;
    jagged?: number;
}

export declare interface Threshold {
    threshold?: number;
    options?: ThresholdOptions;
}

export declare interface Modulate {
  brightness?: number;
  saturation?: number;
  hue?: number;
}

export declare interface Format {
    type: string | AvailableFormatInfo;
    options?: OutputOptions | JpegOptions | PngOptions;
}

declare type SharpOption<T = string> = false | T;

export declare interface SharpOptions {
    size?: Size;
    resize?: boolean;
    composite?: Array<{ input: string | Buffer } & OverlayOptions>,
    extract?: SharpOption<Region>;
    trim?: SharpOption<number>;
    flatten?: SharpOption<FlattenOptions>;
    extend?: SharpOption<number | ExtendOptions>;
    negate?: boolean;
    rotate?: SharpOption<boolean | number>;
    flip?: boolean;
    flop?: boolean;
    blur?: SharpOption<boolean | number>;
    sharpen?: SharpOption<boolean | Sharpen>;
    gamma?: SharpOption<boolean | number>;
    grayscale?: boolean;
    greyscale?: boolean;
    normalize?: boolean;
    normalise?: boolean;
    withMetadata?: SharpOption<WriteableMetadata>;
    convolve?: SharpOption<Kernel>;
    threshold?: SharpOption<number | Threshold>;
    toColourspace?: SharpOption;
    toColorspace?: SharpOption;
    toFormat?: SharpOption<string | Format>;
    ensureAlpha?: boolean;
    modulate?: SharpOption<Modulate>;
}

declare interface Sizes extends Size {
  suffix: string;
}

export declare interface CloudStorageOptions extends UploadOptions {
  bucket: string;
  projectId: string;
  keyFilename?: string;
  filename?: string;
  acl?: string;
  sizes?: Sizes[];
  gzip?: boolean;
}

export declare type MulterOptions = SharpOptions & CloudStorageOptions;

declare class MulterSharp {
    constructor(options: MulterOptions)
}

declare function multerSharp(options: MulterOptions): MulterSharp;

export = multerSharp;
