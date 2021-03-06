import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { format, addDays } from 'date-fns';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { ClienteMetadata } from 'types/IContext';
import * as XLSX from 'xlsx';

import { useUser } from 'contexts/User';

import { getBarbeiro } from 'services/get/barbeiros';
import { getClientesMonth } from 'services/get/clientes';

const THIRTYMINUTES = 30 * 60 * 1000;
const pastMonth = new Date();

export function useBarbeiro() {
  const { getFirstCliente, buscaClientesHorario, buscarClientes, clientId } =
    useUser();
  const [toggleDownload, setToggleDownload] = useState(true);
  const [visibleCalendar, setVisibleCalendar] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [approved, setApproved] = useState('');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(
    format(new Date(), 'HH:mm:ss'),
  );
  const [dataExport, setDataExport] = useState<ClienteMetadata[]>([]);
  const defaultSelected: DateRange = {
    from: pastMonth,
    to: addDays(pastMonth, 4),
  };
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
  const [loading, setLoading] = useState(true);

  const dataInicial = format(range?.from as Date, 'yyyy-MM-dd');
  const dataFinal = format(range?.to as Date, 'yyyy-MM-dd');

  function setShiftBarber(turno: string) {
    if (turno === 'morning') {
      return 'Manhã';
    }

    if (turno === 'afternoon') {
      return 'Tarde';
    }

    if (turno === 'night') {
      return 'Noite';
    }
  }

  function exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Mes_${format(range?.to as Date, 'MM')}.xlsx`);
  }

  function tick() {
    setDate(new Date());
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function isBarbeiroApproved() {
    if (approved === 'S') {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    async function verificarStatusBarbeiro() {
      setLoading(true);
      const { data, status, error } = await getBarbeiro(
        clientId as string,
        true,
      );

      if (error) {
        switch (status) {
          default:
            setLoading(false);
            return;
        }
      }

      if (!data) {
        setLoading(false);
        return;
      }
      if (!data[0].j) {
        setLoading(false);
        return;
      }

      if (data[0].j === null) {
        setLoading(false);
        return;
      }

      setApproved(data[0].j[0].admin_confirmed);
      setLoading(false);
    }

    verificarStatusBarbeiro();
  }, []);

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  useEffect(() => {
    const actualHour = format(date, 'HH:mm:ss');
    const dateCliente = `${getFirstCliente()?.hour}:00`;

    const actualHourMinutePlusOne = format(
      new Date(date.setMinutes(date.getMinutes() + 1)),
      'HH:mm',
    );

    if (actualHour === dateCliente) {
      buscaClientesHorario(actualHourMinutePlusOne);
    }
  }, [date]);

  useEffect(() => {
    const interval = setInterval(() => {
      buscarClientes();

      const dateAtual = format(new Date(), 'HH:mm:ss');
      setUltimaAtualizacao(dateAtual);
    }, THIRTYMINUTES);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function buscarDadosParaExcel() {
      const { data, error, status } = await getClientesMonth(
        clientId || '',
        dataInicial,
        dataFinal,
      );

      if (error) {
        switch (status) {
          default:
            return;
        }
      }

      if (!data) return;
      if (!data[0].j) return;
      if (!data[0].j[0]) return;

      const newValues = data[0].j.map((cliente: ClienteMetadata) => ({
        id: cliente.id,
        Nome: cliente.client_name,
        Horario: cliente.hour,
        Data: format(new Date(cliente.appointment_date), 'dd/MM/yyyy'),
        Turno: setShiftBarber(cliente.shift),
      }));

      setDataExport(newValues);
    }

    if (toggleDownload === false) {
      buscarDadosParaExcel();
    }
  }, [dataInicial, dataFinal]);

  useEffect(() => {
    const barberNewNotification = Cookies.get('barbeiro_notification');

    if (barberNewNotification !== 'success') {
      Swal.fire({
        title: 'Novidade no ar!',
        text: 'Agora você barbeiro pode validar o horário de seus clientes! Basta você ir no menu "Validar Horário" ou abrir sua camera e scanear o QR code do cliente. Essa opção é opcional, mas é util para ter um controle de quem marca e não comparece no horário marcado.',
        icon: 'info',
        confirmButtonColor: '#ff9000',
        cancelButtonColor: '#CA0B00',
        background: '#312e38',
        color: '#f4ede8',
        confirmButtonText: 'Okay',
      }).then((result) => {
        if (result.value) {
          Cookies.set('barbeiro_notification', 'success', {
            expires: 1,
          });
        }
      });
    }
  }, []);

  const customStyles = {
    content: {
      inset: 'initial',
      border: 'none',
      background: '#312e38',
      overflow: 'auto',
      borderRadius: '4px',
      outline: 'none',
      padding: '0px',
      height: '45vh',
      width: '22rem',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      display: 'flex',
      inset: '0px',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: '10',
    },
  };

  return {
    toggleDownload,
    setToggleDownload,
    modalIsOpen,
    setIsOpen,
    openModal,
    closeModal,
    customStyles,
    date,
    ultimaAtualizacao,
    range,
    setRange,
    exportToExcel,
    pastMonth,
    isBarbeiroApproved: isBarbeiroApproved(),
    visibleCalendar,
    setVisibleCalendar,
    loading,
  };
}
