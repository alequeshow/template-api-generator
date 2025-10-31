using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Template.Contract.Common;

namespace Template.Application.Exceptions
{
    public class ApplicationErrorException : Exception
    {
        public ApplicationErrorException(List<Error> errors)
        {
            Errors = errors;
        }

        public List<Error>? Errors { get; set; }
    }
}
