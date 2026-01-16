import { IsString } from "class-validator";

export class CreateCandidateDto {

    @IsString()
    electionId: number;

    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsString()
    party: string;
    

}