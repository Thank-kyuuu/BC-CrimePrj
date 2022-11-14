package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

//구조체 선언
type CrimeStruct struct{
	CrimeNumber string
	Name string
	Number int
	Wallet string
	Account int
	CrimeField int
	CrimeContent string
}

type DontCrime struct {
	contractapi.Contract
}

func (s *DontCrime) CrimeExists(ctx contractapi.TransactionContextInterface, crimeNumber string) (bool, error){
	//원장에 name을 key로 갖는 데이터가 존재하면 true, 존재하지 않으면 false 반환
	Crimebytes, err := ctx.GetStub().GetState(crimeNumber)
	if err != nil{
		return false, err
	}

	return Crimebytes != nil, nil
}

func (s *DontCrime) RegistCrime(ctx contractapi.TransactionContextInterface, crimeNumber string, name string, number int, wallet string, account int, crimeField int, crimeContent string) error {

	//crimeNumber으로 원장에 값이 존재하는지 체크
	exists, err := s.CrimeExists(ctx, crimeNumber)
	if err != nil{
		return err
	}
	if exists != false{
		return fmt.Errorf(`crimeNumber(%s) is already exists`, crimeNumber)
	}

	//if username != "" {
	//	return fmt.Errorf(`username is not asdf`)
	//}

	//구조체와 JSON 매칭
	Crime := CrimeStruct{
		CrimeNumber : crimeNumber,
		Name : name,
		Number : number,
		Wallet : wallet,
		Account : account,
		CrimeField : crimeField,
		CrimeContent : crimeContent,
	}

	//마샬링
	Crimebytes, err := json.Marshal(Crime)

	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(crimeNumber, Crimebytes)
}

func (s *DontCrime) ReadCrime(ctx contractapi.TransactionContextInterface, crimeNumber string) (*CrimeStruct,error){

	Crimebytes, err := ctx.GetStub().GetState(crimeNumber)
	if err != nil {
		return nil, err
	}
	if Crimebytes == nil {
		return nil, fmt.Errorf(`crimeNumber(%s) is not exists`, crimeNumber)
	}

	var Crime CrimeStruct
	err = json.Unmarshal(Crimebytes, &Crime)
	if err != nil{
		return nil, err
	}

	return &Crime, nil
}

func (s *DontCrime) DeleteCrime(ctx contractapi.TransactionContextInterface, crimeNumber string) error {

	//DelState 호출
	//발생하는 오류 처리 부분 작성

	//crimenumber로 원장에 값이 존재하는 체크
	exists, err := s.CrimeExists(ctx, crimeNumber)
	if err != nil{
		return err
	}
	if exists == false{
		return fmt.Errorf(`crimeNumber(%s) dose not exists`, crimeNumber)
	}

	return ctx.GetStub().DelState(crimeNumber)

}

func (s *DontCrime) SellCrime(ctx contractapi.TransactionContextInterface, crimeNumber string, fromuser string, touser string) error{
	// name으로 요트 조회
	Crime, err := s.ReadCrime(ctx, crimeNumber)
	if err != nil {
		return err
	}
	// 요트의 owner 정보가 == fromuser가 맞는지 체크
	if Crime.CrimeContent != fromuser{
		return fmt.Errorf(`can not sell the crime`)
	}

	//요트 정보의 owner를 touser -> 원장에 다시 덮어씌우기
	Crime.CrimeContent = touser

	Crimebytes, err := json.Marshal(Crime)

	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(crimeNumber, Crimebytes)
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(DontCrime))

	if err != nil {
		fmt.Printf("Error create teamate chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting teamate chaincode: %s", err.Error())
	}
}
