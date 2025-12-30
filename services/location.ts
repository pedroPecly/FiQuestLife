/**
 * ============================================
 * LOCATION SERVICE
 * ============================================
 * 
 * Serviço para rastreamento GPS de distância e rotas.
 * Usado para desafios de corrida, caminhada e ciclismo.
 * 
 * @created 30/12/2025
 */

import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  altitude?: number;
  speed?: number;
}

export interface ActivitySession {
  startTime: number;
  endTime?: number;
  distance: number;
  duration: number;
  route: LocationData[];
  averageSpeed?: number;
  maxSpeed?: number;
}

class LocationService {
  private tracking = false;
  private route: LocationData[] = [];
  private startTime = 0;
  private subscription: any = null;
  private lastLocation: LocationData | null = null;

  /**
   * Solicita permissões de localização
   * @returns true se permissões foram concedidas
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // Solicitar permissão em foreground
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('[LOCATION] Permissão de foreground negada');
        return false;
      }

      console.log('[LOCATION] Permissão de foreground concedida');
      
      // Tentar solicitar background (funcionará em builds customizados, falhará gracefully no Expo Go)
      try {
        const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
        if (bgStatus === 'granted') {
          console.log('[LOCATION] Permissão de background concedida (tracking em background disponível)');
        } else {
          console.log('[LOCATION] Permissão de background não concedida (somente foreground tracking)');
        }
      } catch (bgError) {
        // Expo Go não suporta background, mas não é erro fatal
        console.log('[LOCATION] Background tracking não disponível (Expo Go ou permissão não configurada)');
      }
      
      return true;
    } catch (error) {
      console.error('[LOCATION] Erro ao solicitar permissões:', error);
      return false;
    }
  }

  /**
   * Verifica se as permissões já foram concedidas
   */
  async hasPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('[LOCATION] Erro ao verificar permissões:', error);
      return false;
    }
  }

  /**
   * Verifica se background tracking está disponível e permitido
   */
  async hasBackgroundPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getBackgroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      // Expo Go não suporta, retorna false
      return false;
    }
  }

  /**
   * Obtém localização atual
   */
  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      // Solicitar permissões se não tiver
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        console.log('[LOCATION] Sem permissão, solicitando...');
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Permissão de localização não concedida');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
        altitude: location.coords.altitude ?? undefined,
        speed: location.coords.speed ?? undefined,
      };
    } catch (error) {
      console.error('[LOCATION] Erro ao obter localização:', error);
      return null;
    }
  }

  /**
   * Inicia rastreamento GPS contínuo
   */
  async startTracking(): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Permissão de localização negada');
    }

    this.tracking = true;
    this.startTime = Date.now();
    this.route = [];
    this.lastLocation = null;

    console.log('[LOCATION] Iniciando rastreamento GPS');

    // Obter localização inicial
    const initialLocation = await this.getCurrentLocation();
    if (initialLocation) {
      this.route.push(initialLocation);
      this.lastLocation = initialLocation;
    }

    // Iniciar subscription para atualizações contínuas
    this.subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,    // Atualizar a cada 5 segundos
        distanceInterval: 10,  // Ou quando mover 10 metros
      },
      (location) => {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp,
          altitude: location.coords.altitude ?? undefined,
          speed: location.coords.speed ?? undefined,
        };

        this.route.push(locationData);
        this.lastLocation = locationData;

        console.log('[LOCATION] Nova posição registrada:', {
          lat: locationData.latitude.toFixed(6),
          lon: locationData.longitude.toFixed(6),
          totalPoints: this.route.length,
        });
      }
    );
  }

  /**
   * Para rastreamento GPS e retorna sessão completa
   */
  stopTracking(): ActivitySession {
    this.tracking = false;
    
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }

    const endTime = Date.now();
    const duration = Math.floor((endTime - this.startTime) / 1000); // segundos
    const distance = this.calculateTotalDistance();
    const speeds = this.route.map(p => p.speed).filter(s => s !== undefined) as number[];
    const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : undefined;
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : undefined;

    const session: ActivitySession = {
      startTime: this.startTime,
      endTime,
      distance,
      duration,
      route: this.route,
      averageSpeed,
      maxSpeed,
    };

    console.log('[LOCATION] Rastreamento parado:', {
      distance: `${(distance / 1000).toFixed(2)}km`,
      duration: `${Math.floor(duration / 60)}min`,
      points: this.route.length,
    });

    return session;
  }

  /**
   * Calcula distância total percorrida usando fórmula de Haversine
   */
  private calculateTotalDistance(): number {
    let total = 0;
    
    for (let i = 1; i < this.route.length; i++) {
      const prev = this.route[i - 1];
      const curr = this.route[i];
      total += this.haversine(prev, curr);
    }
    
    return Math.round(total);
  }

  /**
   * Calcula distância entre dois pontos GPS (Haversine formula)
   * @returns distância em metros
   */
  private haversine(p1: LocationData, p2: LocationData): number {
    const R = 6371000; // Raio da Terra em metros
    const dLat = this.toRad(p2.latitude - p1.latitude);
    const dLon = this.toRad(p2.longitude - p1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(p1.latitude)) *
        Math.cos(this.toRad(p2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Converte graus para radianos
   */
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Verifica se está rastreando atualmente
   */
  isTracking(): boolean {
    return this.tracking;
  }

  /**
   * Retorna rota atual
   */
  getRoute(): LocationData[] {
    return this.route;
  }

  /**
   * Retorna distância atual (em tempo real)
   */
  getCurrentDistance(): number {
    return this.calculateTotalDistance();
  }

  /**
   * Retorna duração atual (em tempo real)
   */
  getCurrentDuration(): number {
    if (!this.tracking) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Retorna última localização registrada
   */
  getLastLocation(): LocationData | null {
    return this.lastLocation;
  }

  /**   * Verifica se está rastreando no momento
   */
  isTracking(): boolean {
    return this.tracking;
  }

  /**
   * Obtém distância atual da sessão em metros
   */
  getDistance(): number {
    return this.calculateTotalDistance();
  }

  /**
   * Obtém rota completa da sessão atual
   */
  getRoute(): LocationData[] {
    return [...this.route];
  }

  /**   * Simplifica rota removendo pontos redundantes
   * Útil para reduzir tamanho dos dados ao salvar no servidor
   */
  simplifyRoute(tolerance: number = 0.0001): LocationData[] {
    if (this.route.length < 3) return this.route;

    // Algoritmo Douglas-Peucker simplificado
    const simplified: LocationData[] = [this.route[0]];
    
    for (let i = 1; i < this.route.length - 1; i++) {
      const prev = this.route[i - 1];
      const curr = this.route[i];
      const next = this.route[i + 1];
      
      const dist = this.perpendicularDistance(curr, prev, next);
      
      if (dist > tolerance) {
        simplified.push(curr);
      }
    }
    
    simplified.push(this.route[this.route.length - 1]);
    
    console.log('[LOCATION] Rota simplificada:', {
      original: this.route.length,
      simplified: simplified.length,
      reduction: `${((1 - simplified.length / this.route.length) * 100).toFixed(1)}%`,
    });
    
    return simplified;
  }

  /**
   * Calcula distância perpendicular de um ponto para uma linha
   */
  private perpendicularDistance(point: LocationData, lineStart: LocationData, lineEnd: LocationData): number {
    const x0 = point.latitude;
    const y0 = point.longitude;
    const x1 = lineStart.latitude;
    const y1 = lineStart.longitude;
    const x2 = lineEnd.latitude;
    const y2 = lineEnd.longitude;
    
    const numerator = Math.abs(
      (y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1
    );
    const denominator = Math.sqrt(
      Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)
    );
    
    return numerator / denominator;
  }
}

export default new LocationService();
