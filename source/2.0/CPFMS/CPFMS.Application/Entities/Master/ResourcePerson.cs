using CPFMS.Application.Entities.Base;

namespace CPFMS.Application.Entities.Master
{
	public class ResourcePerson : IdNameBaseEntity
	{
		public string Address { get; set; }
		public string Contact { get; set; }
		public string Remark { get; set; }
		public Village Village { get; set; }
	}
}
