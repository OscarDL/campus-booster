import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Project } from '../../../../../../shared/types/project';

import ProjectDetails from './Details';


type Props = {
  project: Project
};


const ProjectsLine: FC<Props> = ({project}) => {
  const { t } = useTranslation();
  const [details, setDetails] = useState<Project>();
  const past = dayjs(project.endDate).isBefore(dayjs(), 'day');


  return (
    <div className={`course-color-project${past ? ' past' : ''}`}>
      <p className="details__item__date">
        {`${t('planning.projects.for')} ${dayjs(project.endDate).format(t('global.date.mmmm-dd'))} ${t('global.colon')}`}
      </p>

      <p className="details__item__title">
        &nbsp;{project.ClassroomHasCourse.Course?.name} <span>&ndash; {project.title}</span>
      </p>

      <p className="details__item__more">
        <Button onClick={() => setDetails(project)}>
          &nbsp;&nbsp;Expand&nbsp;&nbsp;
        </Button>
      </p>

      {<ProjectDetails project={project} open={!!details} setDetails={setDetails}/>}
    </div>
  );
};


export default ProjectsLine;
