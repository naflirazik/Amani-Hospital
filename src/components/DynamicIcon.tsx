import React from 'react';
import {
  Heart,
  Brain,
  Activity,
  Baby,
  Sparkles,
  ShieldCheck,
  Ear,
  Stethoscope,
  Cross,
  UserCheck,
  HeartPulse,
  Building2,
  Ambulance,
  Microscope,
  Pill,
  Truck,
  FileHeart,
  Video,
  Cpu,
  Award,
  ShieldAlert,
  HeartHandshake,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Heart':
      return <Heart {...props} />;
    case 'Brain':
      return <Brain {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Baby':
      return <Baby {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Ear':
      return <Ear {...props} />;
    case 'Stethoscope':
      return <Stethoscope {...props} />;
    case 'Cross':
      return <Cross {...props} />;
    case 'UserCheck':
      return <UserCheck {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'Building2':
      return <Building2 {...props} />;
    case 'Ambulance':
      return <Ambulance {...props} />;
    case 'Microscope':
      return <Microscope {...props} />;
    case 'Pill':
      return <Pill {...props} />;
    case 'Truck':
      return <Truck {...props} />;
    case 'FileHeart':
      return <FileHeart {...props} />;
    case 'Video':
      return <Video {...props} />;
    case 'Cpu':
      return <Cpu {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'HeartHandshake':
      return <HeartHandshake {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'Phone':
      return <Phone {...props} />;
    case 'Mail':
      return <Mail {...props} />;
    case 'MapPin':
      return <MapPin {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'Star':
      return <Star {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'AlertCircle':
      return <AlertCircle {...props} />;
    case 'HelpCircle':
      return <HelpCircle {...props} />;
    default:
      return <Activity {...props} />;
  }
};
