import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveyUser";

@EntityRepository(SurveyUser)
class SurveysUsersRepostory extends Repository<SurveyUser> {}

export { SurveysUsersRepostory };
