import { ResizeOptions, RGBA, Region, ExtendOptions, ThresholdOptions, AvailableFormatInfo, OutputOptions, JpegOptions, PngOptions, Metadata } from 'sharp';
import { UploadOptions } from '@google-cloud/storage';

export interface Size {
    width?: number;
    height?: number;
    option?: ResizeOptions;
}

export interface Sharpen {
    sigma?: number;
    flat?: number;
    jagged?: number;
}

export interface Threshold {
    threshold?: number;
    options?: ThresholdOptions;
}

export interface Format {
    type: string | AvailableFormatInfo;
    options?: OutputOptions | JpegOptions | PngOptions; 
}

type SharpOption<T = string> = false | T;

interface CloudStorageSize {
    suffix: string;
    width: number;
    height: number;
}

export interface CloudStorageOptions extends UploadOptions {
    bucket: string;
    projectId: string;
    keyFilename?: string;
    filename?: string;
    acl?: string;
    sizes?: CloudStorageSize[]
}

export interface SharpOptions {
    size?: MulterOptions<Size>;
    resize?: SharpOption<Size>;
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
    rotate?: boolean;
    flip?: boolean;
    flop?: boolean;
    blur?: SharpOption<number>;
    sharpen?: SharpOption<Sharpen>;
    gamma?: SharpOption<number>;
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

export type MulterOptions = SharpOptions & CloudStorageOptions;

declare class MulterSharp {
    constructor(options: MulterOptions)
}

declare function multerSharp(options: MulterOptions): MulterSharp;

export = multerSharp;