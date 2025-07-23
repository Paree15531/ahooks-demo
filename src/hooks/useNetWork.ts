import { use, useEffect, useState } from "react";

export interface NetworkState {
  since?: Date; // 记录网络状态最近一次变化的时间
  online?: boolean; // 当前是否在线（true 表示有网络，false 表示断网）
  rtt?: number; // 网络往返时延（Round Trip Time），单位毫秒，表示网络延迟
  type?: string; // 网络类型，如 'wifi'、'cellular'、'ethernet'、'none' 等
  downlink?: number; // 下行带宽速度，单位 Mbps（兆位每秒）
  saveData?: boolean; // 是否开启了省流量模式（Data Saver）
  downlinkMax?: number; // 最大下行带宽速度，单位 Mbps
  effectiveType?: string; // 有效的网络类型，如 'slow-2g'、'2g'、'3g'、'4g'
}
enum NetworkEventType {
  ONLINE = "online",
  OFFLINE = "offline",
  CHANGE = "change",
}

//获取网络连接信息对象
function getConnection() {
  const nav = window.navigator as any;
  if (typeof nav !== "object") {
    return null;
  }
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

//获取网络连接信息对象的属性
function getConnectionProperty(): NetworkState {
  const c = getConnection();
  if (!c) {
    return {};
  }
  return {
    rtt: c.rtt,
    type: c.type,
    saveData: c.saveData,
    downlink: c.downlink,
    downlinkMax: c.downlinkMax,
    effectiveType: c.effectiveType,
  };
}

function useNetwork(): NetworkState {
  const [state, setState] = useState(() => {
    return {
      since: undefined,
      online: true,
      ...getConnectionProperty(),
    };
  });

  useEffect(() => {
    //联网回调函数
    const onOnline = () => {
      setState((prev) => {
        return {
          ...prev,
          online: true,
          since: new Date(),
        };
      });
    };

    //网络断开的回调
    const onOffline = () => {
      setState((prev) => {
        return {
          ...prev,
          online: false,
          since: new Date(),
        };
      });
    };

    //网络更换
    const onConnnectionChange = () => {
      setState((prev) => {
        return {
          ...prev,
          ...getConnectionProperty(),
        };
      });
    };

    window.addEventListener(NetworkEventType.ONLINE, onOnline);
    window.addEventListener(NetworkEventType.OFFLINE, onOffline);

    //检测connection是否发生变化
    const connection = getConnection();
    connection?.addEventListener(NetworkEventType.CHANGE, onConnnectionChange);

    return () => {
      window.removeEventListener(NetworkEventType.ONLINE, onOnline);
      window.removeEventListener(NetworkEventType.OFFLINE, onOffline);
      connection?.removeEventListener(
        NetworkEventType.CHANGE,
        onConnnectionChange
      );
    };
  }, []);

  return state;
}

export { useNetwork };
