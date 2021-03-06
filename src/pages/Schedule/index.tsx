import { DayPicker } from 'react-day-picker';
import { FiCheck } from 'react-icons/fi';
import { SiWhatsapp } from 'react-icons/si';

import ptBR from 'date-fns/locale/pt-BR';

import { Button } from 'components/Button';
import { CardBarbeiroSelected } from 'components/CardBarbeiroSelect';
import { Header } from 'components/Header';
import { Overlay } from 'components/Overlay';

import { horariosManha, horariosTarde, horariosNoite } from 'utils/horarios';

import { useTheme } from 'contexts/Theme';
import { useUser } from 'contexts/User';

import { useOverlay } from 'hooks/useOverlay';
import { useSchedule } from 'hooks/useSchedule';

import { css } from 'styles/calendar.styles';

import styles from './Schedule.module.scss';

export function Schedule() {
  const { theme } = useTheme();
  const {
    barbeiro,
    selectDay,
    setSelectDay,
    selectHours,
    setSelectHours,
    selectDayFormatted,
    selectDayFormattedBR,
    postShedule,
    isHorarioMarcado,
    isDataEHorarioPassado,
    verificaDataEHoraSelecionada,
    status,
  } = useUser();

  const {
    getHorarioAtual,
    desabilitarHorariosAnteriores,
    desabilitarHorariosPosteriores,
    horarioInicialBarbeiroSchedule,
    horarioFinalBarbeiroSchedule,
    numerosFaltantes,
    setWeekDay,
  } = useSchedule();

  const { contactBarbeiro } = useOverlay();

  return (
    <>
      <style>{css}</style>
      <div className={styles.home} data-theme={theme}>
        {status === 'success' && (
          <>
            <Overlay
              calendar
              title="Agendamento concluído"
              description={`Agendamento para ${selectDayFormattedBR} às ${selectHours} com ${barbeiro?.nome}`}
            >
              <FiCheck color="#04D361" size={62} />
            </Overlay>
          </>
        )}
        <Header back />
        <div className={styles.container}>
          <div className={styles.containerCard}>
            <CardBarbeiroSelected barbeiro={barbeiro} />
            <button
              className={styles.whatsapp}
              disabled={barbeiro?.phone === null}
              onClick={() => {
                contactBarbeiro(barbeiro?.phone || '');
              }}
            >
              <SiWhatsapp color="#fff" size={24} />
            </button>
          </div>

          <div className={styles.containerTitle}>
            <h2 className={styles.title}>Escolha uma data</h2>
          </div>

          <div className={styles.calendar}>
            <DayPicker
              mode="single"
              locale={ptBR}
              fromMonth={new Date()}
              selected={selectDay}
              onDayClick={(day) => {
                const weekDayClick = day.getDay();
                getHorarioAtual(String(weekDayClick));
                setWeekDay(String(weekDayClick));
                setSelectHours('');
                setSelectDay(day);
              }}
              modifiers={{
                available: { dayOfWeek: [0, 1, 2, 3, 4, 5, 6] },
              }}
              disabled={[
                {
                  dayOfWeek: numerosFaltantes,
                  before: new Date(),
                },
              ]}
            />
          </div>

          <div className={styles.containerTitle}>
            <h2 className={styles.title}>Escolha o horário</h2>

            <p>Manhã</p>

            <div className={styles.containerHorario}>
              {horariosManha.map((horario) => (
                <button
                  key={horario}
                  disabled={
                    isHorarioMarcado(horario) ||
                    isDataEHorarioPassado(selectDayFormatted, horario) ||
                    desabilitarHorariosAnteriores(
                      horarioInicialBarbeiroSchedule,
                    ).includes(horario) ||
                    desabilitarHorariosPosteriores(
                      horarioFinalBarbeiroSchedule,
                    ).includes(horario)
                  }
                  className={
                    selectHours === horario ? styles.selected : styles.horario
                  }
                  onClick={() => {
                    setSelectHours(horario);
                  }}
                >
                  {horario}
                </button>
              ))}
            </div>

            <p>Tarde</p>

            <div className={styles.containerHorario}>
              {horariosTarde.map((horario) => (
                <button
                  key={horario}
                  disabled={
                    isHorarioMarcado(horario) ||
                    isDataEHorarioPassado(selectDayFormatted, horario) ||
                    desabilitarHorariosAnteriores(
                      horarioInicialBarbeiroSchedule,
                    ).includes(horario) ||
                    desabilitarHorariosPosteriores(
                      horarioFinalBarbeiroSchedule,
                    ).includes(horario)
                  }
                  className={
                    selectHours === horario ? styles.selected : styles.horario
                  }
                  onClick={() => {
                    setSelectHours(horario);
                  }}
                >
                  {horario}
                </button>
              ))}
            </div>

            <p>Noite</p>

            <div className={styles.containerHorario}>
              {horariosNoite.map((horario) => (
                <button
                  key={horario}
                  disabled={
                    isHorarioMarcado(horario) ||
                    isDataEHorarioPassado(selectDayFormatted, horario) ||
                    desabilitarHorariosAnteriores(
                      horarioInicialBarbeiroSchedule,
                    ).includes(horario) ||
                    desabilitarHorariosPosteriores(
                      horarioFinalBarbeiroSchedule,
                    ).includes(horario)
                  }
                  className={
                    selectHours === horario ? styles.selected : styles.horario
                  }
                  onClick={() => {
                    setSelectHours(horario);
                  }}
                >
                  {horario}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="button"
            disabled={!verificaDataEHoraSelecionada()}
            onClick={() => {
              postShedule();
            }}
          >
            Agendar
          </Button>
          <br />
        </div>
      </div>
    </>
  );
}
