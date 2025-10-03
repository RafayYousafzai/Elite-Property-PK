import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Card,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { defaultFormSchema, plotsFormSchema } from "@/data/formSchema";

type FieldType = "boolean" | "number" | "text" | "select";

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
}

export interface CategorySchema {
  id: string;
  title: string;
  fields: Field[];
}

interface FeaturesAmenitiesModalProps {
  onSave?: (values: Record<string, string | number | boolean>) => void;
  selectedAmenities?: Record<string, string | number | boolean>;
  type?: "default" | "plot";
}

const FeaturesAmenitiesModal: React.FC<FeaturesAmenitiesModalProps> = ({
  onSave,
  selectedAmenities,
  type = "default",
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [activeTab, setActiveTab] = React.useState("0");
  const [formValues, setFormValues] = React.useState<
    Record<string, string | number | boolean>
  >({});

  useEffect(() => {
    if (selectedAmenities) {
      setFormValues(selectedAmenities ?? {});
    }
  }, []);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormValues((prev) => ({ ...prev, [id]: checked }));
  };

  const handleInputChange = (id: string, value: string | number) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // final payload
    console.log("Amenities payload:", formValues);
    if (onSave) {
      onSave(formValues);
    }
    onOpenChange();
  };

  const renderField = (field: Field) => {
    const current = formValues[field.id];

    if (field.type === "boolean") {
      return (
        <Checkbox
          key={field.id}
          isSelected={Boolean(current)}
          onValueChange={(checked) => handleCheckboxChange(field.id, checked)}
          className="mb-3"
        >
          {field.label}
        </Checkbox>
      );
    }

    if (field.type === "number") {
      return (
        <div key={field.id} className="mb-3">
          <Input
            type="number"
            label={field.label}
            value={current !== undefined ? String(current) : ""}
            onValueChange={(value) =>
              handleInputChange(field.id, value === "" ? "" : Number(value))
            }
            placeholder={field.label}
            variant="flat"
          />
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.id} className="mb-3">
          <Select
            label={field.label}
            placeholder={`Select ${field.label}`}
            selectedKeys={current ? [String(current)] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              handleInputChange(field.id, selected ? String(selected) : "");
            }}
            variant="flat"
          >
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt}>{opt}</SelectItem>
            ))}
          </Select>
        </div>
      );
    }

    // text
    return (
      <div key={field.id} className="mb-3">
        <Input
          type="text"
          label={field.label}
          value={current !== undefined ? String(current) : ""}
          onValueChange={(value) => handleInputChange(field.id, value)}
          placeholder={field.label}
          variant="flat"
        />
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden">
      <Button
        onPress={() => {
          onOpen();
          setFormValues(selectedAmenities ?? {});
        }}
        color="primary"
        startContent={<Icon icon="lucide:list-checks" className="h-5 w-5" />}
        className="font-medium"
      >
        Features & Amenities
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="outside"
      >
        <ModalContent className="!py-4">
          {(onClose) => (
            <>
              <ModalHeader>
                <div>
                  <h3 className="text-lg font-semibold">
                    Features & Amenities
                  </h3>
                  <p className="text-sm text-default-500">
                    Select all the features and amenities that apply to this
                    property
                  </p>
                </div>
              </ModalHeader>

              <ModalBody className="!py-10">
                <Card className="border-none shadow-none">
                  <Tabs
                    aria-label="Features & Amenities Categories"
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(String(key))}
                    variant="solid"
                  >
                    {type === "plot"
                      ? plotsFormSchema.map((cat, idx) => (
                          <Tab key={String(idx)} title={cat.title}>
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cat.fields?.map((f) =>
                                  renderField({
                                    ...f,
                                    type: f.type as FieldType,
                                  })
                                )}
                              </div>
                            </div>
                          </Tab>
                        ))
                      : defaultFormSchema.map((cat, idx) => (
                          <Tab key={String(idx)} title={cat.title}>
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cat.fields?.map((f) =>
                                  renderField({
                                    ...f,
                                    type: f.type as FieldType,
                                  })
                                )}
                              </div>
                            </div>
                          </Tab>
                        ))}
                  </Tabs>
                </Card>
              </ModalBody>

              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FeaturesAmenitiesModal;
