import { ResizeOptions, RGBA, Region, ExtendOptions, ThresholdOptions, AvailableFormatInfo, OutputOptions, JpegOptions, PngOptions, Metadata, Kernel } from 'sharp';
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

export declare interface Format {
    type: string | AvailableFormatInfo;
    options?: OutputOptions | JpegOptions | PngOptions;
}

declare type SharpOption<T = string> = false | T;

export declare interface SharpOptions {
    size?: Size;
    resize?: boolean;
    crop?: SharpOption<string | number>;
    background?: SharpOption<RGBA | string>;
    embed?: boolean;
    max?: boolean;
    min?: boolean;
    withoutEnlargement?: boolean;
    ignoreAspectRatio?: boolean;
    extract?: SharpOption<Region>;
    trim?: SharpOption<number>;
    flatten?: boolean;
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
    withMetadata?: SharpOption<Metadata>;
    convolve?: SharpOption<Kernel>;
    threshold?: SharpOption<number | Threshold>;
    toColourspace?: SharpOption;
    toColorspace?: SharpOption;
    toFormat?: SharpOption<string | Format>;
    gzip?: boolean;
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
  sizes?: Sizes[]
}

export declare type MulterOptions = SharpOptions & CloudStorageOptions;

declare class MulterSharp {
    constructor(options: MulterOptions)
}

declare function multerSharp(options: MulterOptions): MulterSharp;

export = multerSharp;
