#include "FinanceCommand.h"
#include <iostream>

FinanceCommand::FinanceCommand()
{
    // The default constructor.
}

void FinanceCommand::execute(std::string id, std::string info)
{
    // This function should output in the terminal based on the type of command.

    // Finance_Code :_<id><newLine>
    // Finance_Information :_<info><newLine>
    std::cout << "Finance Code: " << id << std::endl;
    std::cout << "Finance Information: " << info << std::endl;
}

std::string FinanceCommand::getType()
{
    // Returns "Finance"
    return "Finance";
}
