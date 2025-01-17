/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  CreatePoint,
  Point,
  INotification,
  ICreateUser,
} from "@customtypes/index";
import Cookies from "js-cookie";

export const useApi = () => {
  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

  const storedAuth = Cookies.get("auth");
  const parsedAuth = JSON.parse(storedAuth || "");
  const accesskey = parsedAuth ? parsedAuth.accessKey : "";

  const authorizationHeader = {
    headers: { Authorization: `Bearer ${accesskey}` },
  };

  async function login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const request = await api.post(`/auth/login`, {
      username: username,
      password: password,
    });
    return request;
  }

  async function getProfile() {
    const request = await api.get(`/auth/profile`, authorizationHeader);
    return request.data;
  }

  async function createUser(user: ICreateUser) {
    try {
      return await api.post("/users/register", user);
    } catch (error: any) {
      if (error.response) return error.response;
      throw error;
    }
  }

  async function createPrivilegedUser(user: ICreateUser) {
    try {
      return await api.post("/users/admin/register", user, authorizationHeader);
    } catch (error: any) {
      if (error.response) return error.response;
      throw error;
    }
  }

  async function getPoint(id: string): Promise<Point> {
    const request = await api.get(`/point/${id}`, authorizationHeader);
    return request.data;
  }

  async function getPointsNearby(
    lat: number,
    lng: number,
    maxDistance: number
  ): Promise<Point[]> {
    const params = {
      lat,
      lng,
      maxDistance,
    };
    try {
      const request = await api.get("/points/nearby", {
        ...authorizationHeader,
        params,
      });
      return request.data;
    } catch (error: any) {
      if (error.response) return error.response;
      throw error;
    }
  }

  async function getAllPoints(): Promise<Point[]> {
    const request = await api.get(`/points`, authorizationHeader);
    return request.data;
  }

  async function createPoint(point: CreatePoint): Promise<{
    status: number;
    data: Point;
  }> {
    try {
      return await api.post(`/points/create`, point, authorizationHeader);
    } catch (error: any) {
      if (error.response) return error.response;
      throw error;
    }
  }

  async function getUserNotification({
    isRead,
    isDeleted,
    type,
    expiresAt,
  }: {
    isRead: boolean;
    isDeleted: boolean;
    type?: string;
    expiresAt?: Date;
  }): Promise<{
    notifications: INotification[];
    total: number;
  }> {
    const response = await api.get("notifications/global/all/filter", {
      params: {
        isRead,
        isDeleted,
        type,
        expiresAt,
      },
      ...authorizationHeader,
    });
    return response.data;
  }

  return {
    login,
    getProfile,
    createUser,
    createPrivilegedUser,
    getPoint,
    getPointsNearby,
    createPoint,
    getAllPoints,
    getUserNotification,
  };
};
