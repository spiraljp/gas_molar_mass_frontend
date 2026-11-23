/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** AuthStubRequest */
export interface AuthStubRequest {
  /** Username */
  username: string;
  /** Password */
  password: string;
}

/** AuthStubResponse */
export interface AuthStubResponse {
  /** Message */
  message: string;
  /** Current User Id */
  current_user_id?: number | null;
}

/** Body_api_create_gas_api_gases_post */
export interface BodyApiCreateGasApiGasesPost {
  /** Gas Name */
  gas_name: string;
  /** Image */
  image: File | Blob;
  /** Video */
  video: File | Blob;
}

/** GasActionResponse */
export interface GasActionResponse {
  /** Id */
  id: number;
  /** Gas Status */
  gas_status: string;
  /** Message */
  message: string;
}

/** GasDraftResponse */
export interface GasDraftResponse {
  /** Id */
  id: number;
  /** Gas Name */
  gas_name: string;
  /** Gas Formula */
  gas_formula: string;
  /** Short Description */
  short_description: string;
  /** Gas Image Url */
  gas_image_url: string | null;
  /** Gas Video Url */
  gas_video_url: string | null;
  /** Molar Mass */
  molar_mass: number | null;
  /** Density Normal Conditions */
  density_normal_conditions: number | null;
  /** Gas Status */
  gas_status: string;
}

/** GasFeedItem */
export interface GasFeedItem {
  /** Id */
  id: number;
  /** Gas Name */
  gas_name: string;
  /** Gas Formula */
  gas_formula: string;
  /** Short Description */
  short_description: string;
  /** Gas Video Url */
  gas_video_url: string | null;
  /** Molar Mass */
  molar_mass: number | null;
  /** Density Normal Conditions */
  density_normal_conditions: number | null;
  /** Likes Count */
  likes_count: number;
  /** Is Liked */
  is_liked: number;
}

/** GasLikeRequest */
export interface GasLikeRequest {
  /** Value */
  value: number;
}

/** GasListItem */
export interface GasListItem {
  /** Id */
  id: number;
  /** Gas Name */
  gas_name: string;
  /** Gas Formula */
  gas_formula: string;
  /** Short Description */
  short_description: string;
  /** Gas Image Url */
  gas_image_url: string | null;
  /** Gas Video Url */
  gas_video_url: string | null;
  /** Molar Mass */
  molar_mass: number | null;
  /** Density Normal Conditions */
  density_normal_conditions: number | null;
  /** Likes Count */
  likes_count: number;
  /** Is Owner */
  is_owner: number;
}

/** GasPublishRequest */
export interface GasPublishRequest {
  /** Molar Mass */
  molar_mass: number;
  /** Density Normal Conditions */
  density_normal_conditions: number;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** UserRegisterRequest */
export interface UserRegisterRequest {
  /** Username */
  username: string;
  /** Password */
  password: string;
}

/** UserResponse */
export interface UserResponse {
  /** Id */
  id: number;
  /** Username */
  username: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Gas Catalog App
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Возвращает опубликованные газы. Поддерживает фильтрацию по названию через query-параметр search. Доступно гостю.
     *
     * @name ApiGetGasesApiGasesGet
     * @summary Получить список газов
     * @request GET:/api/gases
     */
    apiGetGasesApiGasesGet: (
      query?: {
        /**
         * Search
         * @default ""
         */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GasListItem[], HTTPValidationError>({
        path: `/api/gases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает газ в статусе draft и загружает изображение и видео в MinIO. creator_id берется из авторизованной cookie-сессии.
     *
     * @name ApiCreateGasApiGasesPost
     * @summary Создать газ
     * @request POST:/api/gases
     */
    apiCreateGasApiGasesPost: (
      data: BodyApiCreateGasApiGasesPost,
      params: RequestParams = {},
    ) =>
      this.request<GasDraftResponse, HTTPValidationError>({
        path: `/api/gases`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает опубликованный газ для ленты. Без параметров возвращает первый газ. С gas_id и next=true возвращает следующий опубликованный газ. Доступно гостю.
     *
     * @name ApiGetFeedApiGasesFeedGet
     * @summary Получить газ для ленты
     * @request GET:/api/gases/feed
     */
    apiGetFeedApiGasesFeedGet: (
      query?: {
        /** Gas Id */
        gas_id?: number | null;
        /**
         * Next
         * @default false
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<GasFeedItem, HTTPValidationError>({
        path: `/api/gases/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает черновик текущего авторизованного пользователя. Требует cookie session_id.
     *
     * @name ApiGetDraftApiGasesDraftGet
     * @summary Получить черновик газа
     * @request GET:/api/gases/draft
     */
    apiGetDraftApiGasesDraftGet: (params: RequestParams = {}) =>
      this.request<GasDraftResponse, HTTPValidationError>({
        path: `/api/gases/draft`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Публикует черновик текущего пользователя. Гость получает 401, чужой газ нельзя опубликовать.
     *
     * @name ApiPublishGasApiGasesGasIdPublishPut
     * @summary Опубликовать газ
     * @request PUT:/api/gases/{gas_id}/publish
     */
    apiPublishGasApiGasesGasIdPublishPut: (
      gasId: number,
      data: GasPublishRequest,
      params: RequestParams = {},
    ) =>
      this.request<GasActionResponse, HTTPValidationError>({
        path: `/api/gases/${gasId}/publish`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет soft delete газа текущего пользователя: статус меняется на deleted.
     *
     * @name ApiDeleteGasApiGasesGasIdDelete
     * @summary Удалить газ
     * @request DELETE:/api/gases/{gas_id}
     */
    apiDeleteGasApiGasesGasIdDelete: (
      gasId: number,
      params: RequestParams = {},
    ) =>
      this.request<GasActionResponse, HTTPValidationError>({
        path: `/api/gases/${gasId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description Ставит или убирает лайк от текущего авторизованного пользователя. value=1 ставит лайк, value=0 убирает.
     *
     * @name ApiSetLikeApiGasesGasIdLikePost
     * @summary Поставить или убрать лайк
     * @request POST:/api/gases/{gas_id}/like
     */
    apiSetLikeApiGasesGasIdLikePost: (
      gasId: number,
      data: GasLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/gases/${gasId}/like`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
