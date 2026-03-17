import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Trash2, CheckCircle } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import useAppointmentStore from '../store/appointmentStore';
import AppointmentModal from '../components/AppointmentModal';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { appointments, fetchAppointments, deleteAppointment, loading } = useAppointmentStore();

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    await fetchAppointments({
      date: format(monthStart, 'yyyy-MM-dd'),
      dateEnd: format(monthEnd, 'yyyy-MM-dd')
    });
  };

  const uniqueAppointments = useMemo(() => {
    const map = new Map();
    appointments.forEach(apt => {
      if (apt && apt._id) {
        map.set(apt._id, apt);
      }
    });
    return Array.from(map.values());
  }, [appointments]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (e, appointment) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setSelectedDate(new Date(appointment.date));
    setIsModalOpen(true);
  };

  const handleDelete = async (e, appointmentId) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      await deleteAppointment(appointmentId);
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      confirme: 'bg-green-100 text-green-700 border-green-200',
      annule: 'bg-red-100 text-red-700 border-red-200',
      termine: 'bg-blue-100 text-blue-700 border-blue-200',
      absent: 'bg-orange-100 text-orange-700 border-orange-200',
      en_attente: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[statut] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayStr = format(cloneDay, "yyyy-MM-dd");
      const dayAppointments = uniqueAppointments.filter(apt => {
        const aptDate = format(new Date(apt.date), "yyyy-MM-dd");
        return aptDate === dayStr && apt.statut === 'confirme';
      }).sort((a, b) => a.heure.localeCompare(b.heure));

      days.push(
        <div
          key={dayStr}
          onClick={() => handleDayClick(cloneDay)}
          className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border border-slate-50 transition-all relative flex flex-col ${
            !isSameMonth(cloneDay, monthStart) ? "bg-slate-50/50 text-slate-300" : 
            isSameDay(cloneDay, new Date()) ? "bg-primary-50/30 font-semibold" : "bg-white"
          } hover:bg-slate-50 cursor-pointer group`}
        >
          <div className="flex justify-between items-start mb-1 sm:mb-2">
            <span className={`h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg text-xs sm:text-sm font-black transition-all ${
              isSameDay(cloneDay, new Date()) ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-slate-600'
            }`}>
              {format(cloneDay, 'd')}
            </span>
            {dayAppointments.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="hidden sm:flex bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-200 items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5" />
                  {dayAppointments.length}
                </span>
                <div className="sm:hidden w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto max-h-[40px] sm:max-h-[80px]">
            {dayAppointments.slice(0, 3).map((apt) => (
              <div
                key={apt._id}
                onClick={(e) => handleAppointmentClick(e, apt)}
                className={`hidden sm:block text-[10px] p-1.5 rounded-lg border shadow-sm transition-all hover:scale-[1.02] ${getStatusColor(apt.statut)} group/item`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate font-black uppercase tracking-tight">
                    {apt.heure} - {apt.patientId?.nom}
                  </span>
                </div>
              </div>
            ))}
            {dayAppointments.length > 3 && (
              <p className="hidden sm:block text-[9px] text-slate-400 font-bold text-center">
                + {dayAppointments.length - 3} autres
              </p>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Premium */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200/50">
            <button onClick={prevMonth} className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <h2 className="px-6 font-black text-slate-900 text-lg min-w-[200px] text-center capitalize tracking-tight">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            <button onClick={nextMonth} className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-600">
              <ChevronRight size={20} />
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-6 py-3 rounded-xl hover:bg-primary-100 transition-all active:scale-95"
          >
            Aujourd'hui
          </button>
        </div>

        <button
          onClick={() => {
            setSelectedDate(new Date());
            setSelectedAppointment(null);
            setIsModalOpen(true);
          }}
          className="w-full lg:w-auto px-8 py-4 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus size={20} />
          Nouveau rendez-vous
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 animate-pulse">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce mr-1"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-.3s] mr-1"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
        </div>
      )}

      {/* Grille du calendrier Responsive */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden ring-1 ring-slate-100">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {daysOfWeek.map((dayName) => (
            <div key={dayName} className="py-4 text-center text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              {dayName}
            </div>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-slate-50">
          {rows}
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
          setSelectedDate(null);
        }}
        appointment={selectedAppointment}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar;
