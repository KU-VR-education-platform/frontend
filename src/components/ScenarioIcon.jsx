import { 
  FaTrafficLight, 
  FaBus, 
  FaHamburger, 
  FaStore,
  FaGraduationCap,
  FaChartLine,
  FaUsers,
  FaVrCardboard,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaChartBar,
  FaFileAlt
} from 'react-icons/fa'

const iconMap = {
  TrafficLight: FaTrafficLight,
  Bus: FaBus,
  Restaurant: FaHamburger,
  Store: FaStore,
  GraduationCap: FaGraduationCap,
  ChartLine: FaChartLine,
  Users: FaUsers,
  VrCardboard: FaVrCardboard,
  Clock: FaClock,
  CheckCircle: FaCheckCircle,
  TimesCircle: FaTimesCircle,
  ExclamationTriangle: FaExclamationTriangle,
  Lightbulb: FaLightbulb,
  ChartBar: FaChartBar,
  FileAlt: FaFileAlt
}

export default function ScenarioIcon({ type, size = 24, className = '' }) {
  const IconComponent = iconMap[type] || FaFileAlt
  
  return <IconComponent size={size} className={className} />
}

